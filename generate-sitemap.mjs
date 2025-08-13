// generate-sitemap.mjs
import { readdirSync, readFileSync, writeFileSync, statSync } from "fs";
import { join, basename } from "path";

const DOMAIN = "https://seohub.dk";
const ROOT = process.cwd();
const BLOG_DIR = join(ROOT, "blog");

// ---------- utils ----------
const isoDate = (d) => new Date(d).toISOString().slice(0, 10);
const clamp = (s, n) => (s.length <= n ? s : s.slice(0, n - 1).trimEnd() + "…");
const htmlText = (s) =>
  s.replace(/<\/?[^>]+>/g, " ").replace(/\s+/g, " ").trim();

// Smart titel fra <h1> eller filnavn
function inferTitle(html, filePath) {
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1) return htmlText(h1[1]);
  const fn = basename(filePath, ".html").replace(/[-_]+/g, " ").trim();
  return fn.charAt(0).toUpperCase() + fn.slice(1);
}

// Smart description fra første <p> (fallback til kort tekst fra hele dokumentet)
function inferDescription(html) {
  const p = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  const raw = htmlText(p ? p[1] : htmlText(html));
  // 150–160 tegn er fint til meta
  return clamp(raw, 160);
}

// Indsæt eller opdatér <title> og <meta name="description">
// Returnerer { html, changed }
function ensureHeadMeta(html, filePath) {
  let changed = false;

  // Sørg for at der er <head>…</head>
  if (!/<head[^>]*>/i.test(html)) {
    html = html.replace(/<html[^>]*>/i, "$&\n<head></head>");
    changed = true;
  }

  // TITLE
  const hasTitle = /<title>[\s\S]*?<\/title>/i.test(html);
  if (!hasTitle) {
    const title = inferTitle(html, filePath) + " | Seohub.dk";
    html = html.replace(
      /<head[^>]*>/i,
      `$&\n  <title>${escapeHtml(title)}</title>`
    );
    changed = true;
  }

  // DESCRIPTION
  const hasDesc = /<meta\s+name=["']description["'][^>]*>/i.test(html);
  if (!hasDesc) {
    const desc = inferDescription(html);
    html = html.replace(
      /<head[^>]*>/i,
      `$&\n  <meta name="description" content="${escapeHtml(desc)}">`
    );
    changed = true;
  }

  return { html, changed };
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ---------- 1) Saml statiske sider ----------
const staticPages = [
  { path: "/", changefreq: "weekly", priority: 0.8, file: "index.html" },
  { path: "/serp-preview.html", changefreq: "monthly", priority: 0.6, file: "serp-preview.html" },
  { path: "/robots-generator.html", changefreq: "monthly", priority: 0.6, file: "robots-generator.html" },
  { path: "/sitemap-generator.html", changefreq: "monthly", priority: 0.6, file: "sitemap-generator.html" },
  { path: "/blog/", changefreq: "weekly", priority: 0.6, file: "blog/index.html" },
];

// `lastmod` fra filen (hvis findes), ellers i dag
function lastmodFrom(fileRelative) {
  try {
    const st = statSync(join(ROOT, fileRelative));
    return isoDate(st.mtime);
  } catch {
    return isoDate(Date.now());
  }
}

const staticUrls = staticPages.map((p) => ({
  loc: `${DOMAIN}${p.path}`,
  changefreq: p.changefreq,
  priority: p.priority.toFixed(1),
  lastmod: lastmodFrom(p.file),
}));

// ---------- 2) Blog: scan /blog/*.html og sikr meta ----------
let blogUrls = [];
try {
  const files = readdirSync(BLOG_DIR)
    .filter((f) => f.toLowerCase().endsWith(".html") && f.toLowerCase() !== "index.html");

  for (const fname of files) {
    const fpath = join(BLOG_DIR, fname);
    let html = readFileSync(fpath, "utf8");
    const before = html;

    // Indsæt TITLE + DESCRIPTION hvis mangler
    const result = ensureHeadMeta(html, fpath);
    if (result.changed) {
      writeFileSync(fpath, result.html, "utf8");
      html = result.html;
      console.log(`✍️  Tilføjede manglende meta til /blog/${fname}`);
    }

    const urlPath = `/blog/${fname}`;
    blogUrls.push({
      loc: `${DOMAIN}${urlPath}`,
      changefreq: "monthly",
      priority: "0.5",
      lastmod: isoDate(statSync(fpath).mtime),
    });
  }
} catch (e) {
  console.warn("Ingen /blog/ mappe eller kunne ikke læse den:", e.message);
}

// ---------- 3) Byg XML ----------
const allUrls = [...staticUrls, ...blogUrls];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
    <lastmod>${u.lastmod}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>
`;

// ---------- 4) Skriv sitemap i roden ----------
writeFileSync(join(ROOT, "sitemap.xml"), xml, "utf8");
console.log(`✅ sitemap.xml genereret med ${allUrls.length} URL'er.`);
