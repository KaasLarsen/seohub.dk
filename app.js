// Seohub – static React (CDN) build
const { useState, useMemo } = React;

function Section({ title, children }) {
  return (
    React.createElement("div", { className: "bg-white/70 backdrop-blur rounded-2xl shadow p-6 border border-neutral-100 my-8" },
      React.createElement("h2", { className: "text-xl font-semibold mb-4" }, title),
      children
    )
  );
}

function Card({ title, description, children }) {
  return (
    React.createElement("div", { className: "rounded-2xl border p-4 shadow-sm bg-white" },
      React.createElement("div", { className: "mb-3" },
        React.createElement("h3", { className: "text-lg font-semibold leading-tight" }, title),
        description ? React.createElement("p", { className: "text-sm text-neutral-600 mt-1" }, description) : null
      ),
      children
    )
  );
}

function TextInput({ label, value, onChange, placeholder, textarea=false, rows=3 }) {
  return (
    React.createElement("label", { className: "block mb-3" },
      React.createElement("span", { className: "block text-sm font-medium mb-1" }, label),
      textarea
        ? React.createElement("textarea", { value, onChange: e=>onChange(e.target.value), placeholder, rows, className: "w-full border rounded-xl p-3 focus:outline-none focus:ring focus:ring-indigo-200" })
        : React.createElement("input", { value, onChange: e=>onChange(e.target.value), placeholder, className: "w-full border rounded-xl p-3 focus:outline-none focus:ring focus:ring-indigo-200" })
    )
  );
}

function CopyButton({ getText, label="Kopiér" }) {
  const [copied, setCopied] = useState(false);
  return React.createElement("button", {
    onClick: async () => {
      try {
        await navigator.clipboard.writeText(getText());
        setCopied(true);
        setTimeout(()=>setCopied(false), 1500);
      } catch(e) {
        alert("Kunne ikke kopiere. Markér og kopier manuelt.");
      }
    },
    className: "px-3 py-2 rounded-xl text-sm border bg-neutral-50 hover:bg-neutral-100"
  }, copied ? "Kopieret!" : label);
}

function DownloadButton({ filename, getContent, label="Download" }) {
  return React.createElement("button", {
    onClick: () => {
      const blob = new Blob([getContent()], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    },
    className: "px-3 py-2 rounded-xl text-sm border bg-neutral-50 hover:bg-neutral-100"
  }, label);
}

// Keyword Ideas
function KeywordIdeas() {
  const [seed, setSeed] = useState("");
  const [locale, setLocale] = useState("da");
  const ideas = useMemo(() => {
    if (!seed.trim()) return [];
    const s = seed.trim().toLowerCase();
    const prefixes = ["bedste","billig","guide til","hvordan","tjekliste","tips til","kritiske fejl i","idéer til","steg for steg","2025"];
    const suffixes = ["pris","eksempler","skabelon","værktøjer","for begyndere","for små virksomheder","lokal seo","teknisk seo","content","linkbuilding"];
    const variants = new Set();
    prefixes.forEach(p=>variants.add(`${p} ${s}`));
    suffixes.forEach(x=>variants.add(`${s} ${x}`));
    ["nær mig","gratis","hurtigt","avanceret","eksempel","skema"].forEach(m=>variants.add(`${s} ${m}`));
    return Array.from(variants).slice(0, 60);
  }, [seed]);

  return (
    React.createElement(Section, { title: "nøgleordsidéer (hurtig)" },
      React.createElement("div", { className: "grid md:grid-cols-3 gap-4" },
        React.createElement("div", { className: "md:col-span-1" },
          React.createElement(TextInput, { label: "emne/seed", value: seed, onChange: setSeed, placeholder: "fx 'seo' eller 'kapselkaffe'" }),
          React.createElement("label", { className: "block mb-4" },
            React.createElement("span", { className: "block text-sm font-medium mb-1" }, "sprog"),
            React.createElement("select", { value: locale, onChange: e=>setLocale(e.target.value), className: "w-full border rounded-xl p-3" },
              React.createElement("option", { value: "da" }, "Dansk"),
              React.createElement("option", { value: "en" }, "English"),
            )
          ),
          React.createElement("div", { className: "flex gap-2" },
            React.createElement(CopyButton, { getText: ()=>ideas.join("\n") }),
            React.createElement(DownloadButton, { filename: `keywords-${seed || 'seed'}.txt`, getContent: ()=>ideas.join("\n") })
          )
        ),
        React.createElement("div", { className: "md:col-span-2" },
          React.createElement("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-3" },
            ideas.map((k,i)=> React.createElement("div", { key:i, className:"border rounded-xl p-3 text-sm bg-neutral-50" }, k))
          )
        )
      )
    )
  );
}

// Serp & Meta
function SerpAndMeta() {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("https://www.seohub.dk/");
  const [desc, setDesc] = useState("");
  const titleLen = title.length;
  const descLen = desc.length;
  const titleOk = titleLen >= 50 && titleLen <= 60;
  const descOk = descLen >= 140 && descLen <= 160;

  return (
    React.createElement(Section, { title: "serp preview & title/meta tjek" },
      React.createElement("div", { className: "grid md:grid-cols-2 gap-6" },
        React.createElement(Card, { title: "indtast oplysninger", description: "skriv titel og metabeskrivelse – få længdeindikatorer i realtime" },
          React.createElement(TextInput, { label: "titel (anbefalet 50–60 tegn)", value: title, onChange: setTitle, placeholder: "fx: seohub – den komplette guide (2025)" }),
          React.createElement(TextInput, { label: "url", value: url, onChange: setUrl }),
          React.createElement(TextInput, { label: "metabeskrivelse (140–160 tegn)", value: desc, onChange: setDesc, textarea: true, rows: 4 }),
          React.createElement("div", { className: "flex items-center gap-3 text-sm" },
            React.createElement("span", { className: `px-2 py-1 rounded-full ${titleOk ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}` }, `titel: ${titleLen} tegn`),
            React.createElement("span", { className: `px-2 py-1 rounded-full ${descOk ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}` }, `meta: ${descLen} tegn`),
            React.createElement(CopyButton, { label: "kopiér title", getText: ()=>title }),
            React.createElement(CopyButton, { label: "kopiér description", getText: ()=>desc }),
          )
        ),
        React.createElement(Card, { title: "google-lignende forhåndsvisning", description: "simuleret visning – ikke 1:1 med virkelige pixelbredder, men tæt nok til skrivning" },
          React.createElement("div", { className: "rounded-xl border p-4 bg-white" },
            React.createElement("div", { className: "text-[#1a0dab] text-xl leading-snug truncate" }, title || "Din titel vises her"),
            React.createElement("div", { className: "text-[#006621] text-sm mt-1 truncate" }, url),
            React.createElement("div", { className: "text-[#545454] text-sm mt-1" }, desc || "Skriv en præcis metabeskrivelse, der matcher søgeintentionen og inkluderer primært søgeord + USP.")
          )
        )
      )
    )
  );
}

// Robots.txt
function RobotsTxt() {
  const [sitemap, setSitemap] = useState("https://www.seohub.dk/sitemap.xml");
  const [disallow, setDisallow] = useState("/wp-admin/\n*/?s=\n/search\n/cart");
  const [allow, setAllow] = useState("/wp-admin/admin-ajax.php");
  const txt = useMemo(() => {
    const d = disallow.split(/\n+/).map(x=>x.trim()).filter(Boolean).map(x=>`Disallow: ${x}`).join("\n");
    const a = allow.split(/\n+/).map(x=>x.trim()).filter(Boolean).map(x=>`Allow: ${x}`).join("\n");
    return `User-agent: *\n${a}${a && d ? "\n" : ""}${d}\n\nSitemap: ${sitemap}`.trim();
  }, [sitemap, disallow, allow]);

  return (
    React.createElement(Section, { title: "robots.txt generator" },
      React.createElement("div", { className: "grid md:grid-cols-2 gap-6" },
        React.createElement("div", null,
          React.createElement(TextInput, { label: "sitemap url", value: sitemap, onChange: setSitemap }),
          React.createElement(TextInput, { label: "tillad (én pr. linje)", value: allow, onChange: setAllow, textarea: true, rows: 4 }),
          React.createElement(TextInput, { label: "bloker (én pr. linje)", value: disallow, onChange: setDisallow, textarea: true, rows: 6 }),
          React.createElement("div", { className: "flex gap-2" },
            React.createElement(CopyButton, { getText: ()=>txt }),
            React.createElement(DownloadButton, { filename: "robots.txt", getContent: ()=>txt }),
          )
        ),
        React.createElement("div", null,
          React.createElement("pre", { className: "bg-neutral-900 text-neutral-100 rounded-xl p-4 overflow-auto text-sm whitespace-pre-wrap" }, txt)
        )
      )
    )
  );
}

// Sitemap
function SitemapXml() {
  const [base, setBase] = useState("https://www.seohub.dk");
  const [paths, setPaths] = useState("/\n/blog/\n/kontakt");
  const [changefreq, setChangefreq] = useState("weekly");
  const [priority, setPriority] = useState("0.8");

  const xml = useMemo(() => {
    const list = paths.split(/\n+/).map(x=>x.trim()).filter(Boolean)
      .map(p => `${base.replace(/\/$/, "")}${p.startsWith("/") ? "" : "/"}${p}`);
    const items = list.map(loc => `  <url>\n    <loc>${loc}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`).join("\n");
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>`;
  }, [base, paths, changefreq, priority]);

  return (
    React.createElement(Section, { title: "sitemap.xml generator" },
      React.createElement("div", { className: "grid md:grid-cols-2 gap-6" },
        React.createElement("div", null,
          React.createElement(TextInput, { label: "base url", value: base, onChange: setBase }),
          React.createElement(TextInput, { label: "stier (én pr. linje)", value: paths, onChange: setPaths, textarea: true, rows: 6 }),
          React.createElement("div", { className: "grid grid-cols-2 gap-3 mb-4" },
            React.createElement("label", { className: "block" },
              React.createElement("span", { className: "block text-sm font-medium mb-1" }, "changefreq"),
              React.createElement("select", { className: "w-full border rounded-xl p-3", value: changefreq, onChange: e=>setChangefreq(e.target.value) },
                ["always","hourly","daily","weekly","monthly","yearly","never"].map(x => React.createElement("option", { key: x, value: x }, x))
              )
            ),
            React.createElement(TextInput, { label: "priority (0.0–1.0)", value: priority, onChange: setPriority })
          ),
          React.createElement("div", { className: "flex gap-2" },
            React.createElement(CopyButton, { getText: ()=>xml }),
            React.createElement(DownloadButton, { filename: "sitemap.xml", getContent: ()=>xml }),
          )
        ),
        React.createElement("div", null,
          React.createElement("pre", { className: "bg-neutral-900 text-neutral-100 rounded-xl p-4 overflow-auto text-sm whitespace-pre" }, xml)
        )
      )
    )
  );
}

// FAQ Schema
function FaqSchema() {
  const [pairs, setPairs] = useState([{ q: "Hvad er SEO?", a: "SEO står for søgemaskineoptimering." }]);
  const json = useMemo(() => {
    const mainEntity = pairs.filter(p=>p.q.trim() && p.a.trim()).map(p => ({"@type":"Question", name: p.q, acceptedAnswer: {"@type":"Answer", text: p.a}}));
    return JSON.stringify({ "@context":"https://schema.org", "@type":"FAQPage", mainEntity }, null, 2);
  }, [pairs]);

  return (
    React.createElement(Section, { title: "faq schema generator (json-ld)" },
      React.createElement("div", { className: "space-y-4" },
        pairs.map((p,i)=>(
          React.createElement("div", { key:i, className:"grid md:grid-cols-2 gap-3" },
            React.createElement(TextInput, { label: `spørgsmål ${i+1}`, value: p.q, onChange: v=>{ const next=[...pairs]; next[i]={...next[i], q:v}; setPairs(next);} }),
            React.createElement(TextInput, { label: `svar ${i+1}`, value: p.a, onChange: v=>{ const next=[...pairs]; next[i]={...next[i], a:v}; setPairs(next); }, textarea: true, rows: 2 })
          )
        )),
        React.createElement("div", { className: "flex gap-2" },
          React.createElement("button", { className: "px-3 py-2 rounded-xl border", onClick: ()=>setPairs([...pairs, {q:"", a:""}]) }, "tilføj spørgsmål"),
          React.createElement("button", { className: "px-3 py-2 rounded-xl border", onClick: ()=>setPairs(pairs.slice(0,-1)), disabled: pairs.length<=1 }, "fjern sidste"),
          React.createElement(CopyButton, { getText: ()=>json }),
        ),
        React.createElement("pre", { className: "bg-neutral-900 text-neutral-100 rounded-xl p-4 overflow-auto text-sm whitespace-pre-wrap" }, json)
      )
    )
  );
}

// Content Brief
function ContentBrief() {
  const [keyword, setKeyword] = useState("");
  const [audience, setAudience] = useState("begyndere");
  const brief = useMemo(() => {
    if (!keyword.trim()) return null;
    const k = keyword.trim();
    const intent = [
      "informationssøgen (how/guide)",
      "kommerciel research (bedst, top, pris)",
      "transaktion (køb, tilbud)",
      "lokal (nær mig, bynavn)",
    ];
    const h2s = [
      `hvad er ${k}?`,
      `${k}: fordele og ulemper`,
      `${k} – trin for trin`,
      `typiske fejl i ${k} (og løsninger)`,
      `faq om ${k}`,
    ];
    const questions = [
      `hvordan kommer jeg i gang med ${k}?`,
      `hvor lang tid tager ${k}?`,
      `hvad koster ${k}?`,
      `kan jeg gøre ${k} selv?`,
      `hvad er alternativer til ${k}?`,
    ];
    const intern = [
      `link til kategori om ${k}`,
      `link til relateret guide`,
      `link til kontakt/tilbud`,
    ];
    return { intent, h2s, questions, intern };
  }, [keyword]);

  return (
    React.createElement(Section, { title: "content brief (skelet)" },
      React.createElement("div", { className: "grid md:grid-cols-2 gap-6" },
        React.createElement("div", null,
          React.createElement(TextInput, { label: "primært søgeord", value: keyword, onChange: setKeyword, placeholder: "fx 'lokal seo'" }),
          React.createElement(TextInput, { label: "målgruppe", value: audience, onChange: setAudience, placeholder: "fx 'små virksomheder'" }),
          brief && React.createElement("div", { className: "flex gap-2" },
            React.createElement(CopyButton, { getText: ()=>JSON.stringify({ keyword, audience, ...brief }, null, 2), label: "kopiér brief (json)" }),
            React.createElement(DownloadButton, { filename: `brief-${keyword}.json`, getContent: ()=>JSON.stringify({ keyword, audience, ...brief }, null, 2) }),
          )
        ),
        React.createElement("div", { className: "space-y-4" },
          brief ? React.createElement(React.Fragment, null,
            React.createElement(Card, { title: "søgeintention" },
              React.createElement("ul", { className: "list-disc pl-5 text-sm space-y-1" }, brief.intent.map((x,i)=> React.createElement("li", { key:i }, x)))
            ),
            React.createElement(Card, { title: "h2-forslag" },
              React.createElement("ul", { className: "list-disc pl-5 text-sm space-y-1" }, brief.h2s.map((x,i)=> React.createElement("li", { key:i }, x)))
            ),
            React.createElement(Card, { title: "ofte stillede spørgsmål" },
              React.createElement("ul", { className: "list-disc pl-5 text-sm space-y-1" }, brief.questions.map((x,i)=> React.createElement("li", { key:i }, x)))
            ),
            React.createElement(Card, { title: "interne links" },
              React.createElement("ul", { className: "list-disc pl-5 text-sm space-y-1" }, brief.intern.map((x,i)=> React.createElement("li", { key:i }, x)))
            )
          ) : React.createElement("p", { className: "text-sm text-neutral-600" }, "skriv et søgeord for at generere et skelet til din artikel.")
        )
      )
    )
  );
}

function Header() {
  return (
    React.createElement("header", { className: "sticky top-0 z-10 bg-white/80 backdrop-blur border-b" },
      React.createElement("div", { className: "max-w-6xl mx-auto px-4 py-3 flex items-center justify-between" },
        React.createElement("div", { className: "flex items-center gap-2" },
          React.createElement("span", { className: "inline-flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold" }, "S"),
          React.createElement("div", null,
            React.createElement("div", { className: "font-semibold leading-tight" }, "Seohub"),
            React.createElement("div", { className: "text-xs text-neutral-500 leading-tight" }, "gratis seo-værktøjer")
          )
        ),
        React.createElement("nav", { className: "text-sm text-neutral-600" }, "mvp")
      )
    )
  );
}

function App() {
  return (
    React.createElement(React.Fragment, null,
      React.createElement(Header, null),
      React.createElement("main", { className: "max-w-6xl mx-auto px-4 py-8 space-y-8" },
        React.createElement("div", { className: "grid md:grid-cols-3 gap-4" },
          React.createElement(Card, { title: "nøgleord", description: "generér 60+ varianter på få sekunder" },
            React.createElement("a", { href: "#keywords", className: "inline-block px-3 py-2 rounded-xl border bg-neutral-50 hover:bg-neutral-100 text-sm" }, "åbn")
          ),
          React.createElement(Card, { title: "serp & meta", description: "forhåndsvisning + længde tjek" },
            React.createElement("a", { href: "#serp", className: "inline-block px-3 py-2 rounded-xl border bg-neutral-50 hover:bg-neutral-100 text-sm" }, "åbn")
          ),
          React.createElement(Card, { title: "robots.txt", description: "byg og download på 10 sek" },
            React.createElement("a", { href: "#robots", className: "inline-block px-3 py-2 rounded-xl border bg-neutral-50 hover:bg-neutral-100 text-sm" }, "åbn")
          ),
          React.createElement(Card, { title: "sitemap.xml", description: "generér fra liste af urls" },
            React.createElement("a", { href: "#sitemap", className: "inline-block px-3 py-2 rounded-xl border bg-neutral-50 hover:bg-neutral-100 text-sm" }, "åbn")
          ),
          React.createElement(Card, { title: "faq schema", description: "json-ld til faq-udsnit" },
            React.createElement("a", { href: "#faq", className: "inline-block px-3 py-2 rounded-xl border bg-neutral-50 hover:bg-neutral-100 text-sm" }, "åbn")
          ),
          React.createElement(Card, { title: "content brief", description: "skelet til indlæg ud fra søgeord" },
            React.createElement("a", { href: "#brief", className: "inline-block px-3 py-2 rounded-xl border bg-neutral-50 hover:bg-neutral-100 text-sm" }, "åbn")
          )
        ),
        React.createElement("div", { id: "keywords" }, React.createElement(KeywordIdeas, null)),
        React.createElement("div", { id: "serp" }, React.createElement(SerpAndMeta, null)),
        React.createElement("div", { id: "robots" }, React.createElement(RobotsTxt, null)),
        React.createElement("div", { id: "sitemap" }, React.createElement(SitemapXml, null)),
        React.createElement("div", { id: "faq" }, React.createElement(FaqSchema, null)),
        React.createElement("div", { id: "brief" }, React.createElement(ContentBrief, null)),
        React.createElement(Section, { title: "om seohub" },
          React.createElement("p", { className: "text-sm text-neutral-700" }, "Seohub er en gratis værktøjskasse til søgemaskineoptimering. Brug den til at skrive bedre titler og meta, bygge robots.txt og sitemap.xml, lave FAQ schema og planlægge dit indhold.")
        )
      ),
      React.createElement("footer", { className: "text-center text-xs text-neutral-500 py-8" }, `© ${new Date().getFullYear()} Seohub – seohub.dk`)
    )
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));
