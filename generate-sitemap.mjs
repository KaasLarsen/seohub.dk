// generate-sitemap.mjs
import { readFileSync, writeFileSync, existsSync } from "fs";

const BASE = "https://seohub.dk";

// 1) Statisk liste over dine faste sider
const staticUrls = [
  "/",                // forside
  "/serp-preview.html",
  "/robots-generator.html",
  "/sitemap-generator.html",
  "/blog/",           // blog-oversigt
];

// 2) Læs blogindlæg fra /blog/posts.json (valgfrit – hvis den ikke findes, fortsæt bare)
let posts = [];
try {
  if (existsSync("./blog/posts.json")) {
    const raw = readFileSync("./blog/posts.json", "utf8");
    const json = JSON.parse(raw);
    if (Array.isArray(json)) posts = json;
  }
} catch (e) {
  console.warn("Kunne ikke læse /blog/posts.json (fortsætter uden blog-URLs)", e.message);
}

// 3) Byg URL-liste (statisk + blog)
const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

const urls = [
  // statiske sider
  ...staticUrls.map((path) => ({
    loc: toAbs(path),
    changefreq: path === "/" || path === "/blog/" ? "weekly" : "monthly",
    priority: path === "/" ? "0.8" : path === "/blog/" ? "0.6" : "0.6",
    lastmod: today,
  })),
  // blog-URLs baseret på posts.json
  ...posts.map((p) => ({
    loc: toAbs(`/blog/${(p.slug || "").trim()}.html`),
    changefreq: "monthly",
    priority: "0.5",
    lastmod: (p.date && /^\d{4}-\d{2}-\d{2}$/.test(p.date)) ? p.date : today,
  })),
];

// 4) Generér XML
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
    <lastmod>${u.lastmod}</lastmod>
  </url>`).join("\n")}
</urlset>
`;

// 5) Skriv til /sitemap.xml (roden)
writeFileSync("./sitemap.xml", xml, "utf8");
console.log(`✔ sitemap.xml genereret med ${urls.length} URL'er.`);

// helpers
function toAbs(path) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${BASE}${p}`;
}
function escapeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
