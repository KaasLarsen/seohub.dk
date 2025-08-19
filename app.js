// /app.js — Forside med stor blå hero + 3 ikon-kort, Seneste indlæg (auto), sponsorer (uden billeder) og dine inline værktøjer.

const { useState, useMemo, useEffect } = React;

/* ---------- UI helpers ---------- */
function Section({ title, description, children }) {
  return React.createElement(
    "section",
    { className: "bg-white/70 backdrop-blur rounded-2xl shadow p-6 md:p-8 border border-neutral-100" },
    [
      (title || description)
        ? React.createElement("div", { key: "hd", className: "mb-4" }, [
            title ? React.createElement("h2", { key:"t", className:"text-xl md:text-2xl font-semibold" }, title) : null,
            description ? React.createElement("p", { key:"d", className:"text-neutral-600 mt-1" }, description) : null
          ])
        : null,
      children
    ]
  );
}

function Card({ title, description, href, icon, children }) {
  const content = [
    icon ? React.createElement("div", { key:"i", className:"mb-3" }, icon) : null,
    title ? React.createElement("h3", { key:"t", className:"text-lg font-semibold leading-tight" }, title) : null,
    description ? React.createElement("p", { key:"d", className:"text-sm text-neutral-600 mt-1" }, description) : null,
    children ? React.createElement("div", { key:"c", className:"mt-3" }, children) : null
  ];
  if (href) {
    return React.createElement("a", { href, className:"rounded-2xl border p-5 bg-white hover:shadow transition block" }, content);
  }
  return React.createElement("div", { className:"rounded-2xl border p-5 bg-white" }, content);
}

function TextInput({ label, value, onChange, placeholder, textarea=false, rows=3 }) {
  return React.createElement(
    "label",
    { className: "block mb-3" },
    [
      label ? React.createElement("span", { key:"l", className:"block text-sm font-medium mb-1" }, label) : null,
      textarea
        ? React.createElement("textarea", { key:"ta", value, onChange:e=>onChange(e.target.value), placeholder, rows, className:"w-full border rounded-xl p-3 focus:outline-none focus:ring focus:ring-indigo-200" })
        : React.createElement("input", { key:"in", value, onChange:e=>onChange(e.target.value), placeholder, className:"w-full border rounded-xl p-3 focus:outline-none focus:ring focus:ring-indigo-200" })
    ]
  );
}

function CopyButton({ getText, label="Kopiér" }) {
  const [copied, setCopied] = useState(false);
  return React.createElement("button", {
    onClick: async () => {
      try { await navigator.clipboard.writeText(getText()); setCopied(true); setTimeout(()=>setCopied(false), 1500); }
      catch(e){ alert("Kunne ikke kopiere – markér og kopier manuelt."); }
    },
    className:"px-3 py-2 rounded-xl text-sm border bg-neutral-50 hover:bg-neutral-100"
  }, copied ? "Kopieret!" : label);
}

function DownloadButton({ filename, getContent, label="Download" }) {
  return React.createElement("button", {
    onClick: ()=> {
      const blob = new Blob([getContent()], { type:"text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
    },
    className:"px-3 py-2 rounded-xl text-sm border bg-neutral-50 hover:bg-neutral-100"
  }, label);
}

/* ---------- Inline værktøjer ---------- */
function KeywordIdeas() {
  const [seed, setSeed] = useState("");
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

  return React.createElement(Section, { title:"Nøgleordsidéer (hurtig)" },
    React.createElement("div", { className:"grid md:grid-cols-3 gap-4" }, [
      React.createElement("div", { key:"l", className:"md:col-span-1" }, [
        React.createElement(TextInput, { key:"seed", label:"Emne/seed", value:seed, onChange:setSeed, placeholder:"fx 'lokal seo' eller 'kapselkaffe'" }),
        React.createElement("div", { key:"btns", className:"flex gap-2" }, [
          React.createElement(CopyButton, { key:"c", getText:()=>ideas.join("\n") }),
          React.createElement(DownloadButton, { key:"d", filename:`keywords-${seed || 'seed'}.txt`, getContent:()=>ideas.join("\n") })
        ])
      ]),
      React.createElement("div", { key:"r", className:"md:col-span-2" },
        React.createElement("div", { className:"grid sm:grid-cols-2 lg:grid-cols-3 gap-3" },
          ideas.map((k,i)=> React.createElement("div", { key:i, className:"border rounded-xl p-3 text-sm bg-neutral-50" }, k))
        )
      )
    ])
  );
}

function SerpAndMeta() {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("https://www.seohub.dk/");
  const [desc, setDesc] = useState("");
  const tl = title.length, dl = desc.length;
  const okT = tl >= 50 && tl <= 60;
  const okD = dl >= 140 && dl <= 160;

  return React.createElement(Section, { title:"SERP preview & title/meta tjek" },
    React.createElement("div", { className:"grid md:grid-cols-2 gap-6" }, [
      React.createElement(Card, { key:"form", title:"Indtast", description:"Få længdeindikatorer i realtime" },
        [
          React.createElement(TextInput, { key:"t", label:"Titel (50–60 tegn)", value:title, onChange:setTitle, placeholder:"fx: Seohub – SEO værktøjer (2025)" }),
          React.createElement(TextInput, { key:"u", label:"URL", value:url, onChange:setUrl }),
          React.createElement(TextInput, { key:"d", label:"Metabeskrivelse (140–160 tegn)", value:desc, onChange:setDesc, textarea:true, rows:4 }),
          React.createElement("div", { key:"badges", className:"flex items-center gap-3 text-sm" }, [
            React.createElement("span", { key:"tb", className:`px-2 py-1 rounded-full ${okT ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}` }, `titel: ${tl} tegn`),
            React.createElement("span", { key:"db", className:`px-2 py-1 rounded-full ${okD ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}` }, `meta: ${dl} tegn`),
            React.createElement(CopyButton, { key:"ct", label:"kopiér title", getText:()=>title }),
            React.createElement(CopyButton, { key:"cd", label:"kopiér description", getText:()=>desc })
          ])
        ]
      ),
      React.createElement(Card, { key:"prev", title:"Google-lignende forhåndsvisning" },
        React.createElement("div", { className:"rounded-xl border p-4 bg-white" }, [
          React.createElement("div", { key:"pt", className:"text-[#1a0dab] text-xl leading-snug truncate" }, title || "Din titel vises her"),
          React.createElement("div", { key:"pu", className:"text-[#006621] text-sm mt-1 truncate" }, url),
          React.createElement("div", { key:"pd", className:"text-[#545454] text-sm mt-1" }, desc || "Skriv en præcis metabeskrivelse, der matcher søgeintentionen + USP.")
        ])
      )
    ])
  );
}

function RobotsTxt() {
  const [sitemap, setSitemap] = useState("https://www.seohub.dk/sitemap.xml");
  const [disallow, setDisallow] = useState("/wp-admin/\n*/?s=\n/search\n/cart");
  const [allow, setAllow] = useState("/wp-admin/admin-ajax.php");
  const txt = useMemo(() => {
    const d = disallow.split(/\n+/).map(x=>x.trim()).filter(Boolean).map(x=>`Disallow: ${x}`).join("\n");
    const a = allow.split(/\n+/).map(x=>x.trim()).filter(Boolean).map(x=>`Allow: ${x}`).join("\n");
    return `User-agent: *\n${a}${a && d ? "\n" : ""}${d}\n\nSitemap: ${sitemap}`.trim();
  }, [sitemap, disallow, allow]);

  return React.createElement(Section, { title:"Robots.txt generator" },
    React.createElement("div", { className:"grid md:grid-cols-2 gap-6" }, [
      React.createElement("div", { key:"l" }, [
        React.createElement(TextInput, { key:"s", label:"Sitemap URL", value:sitemap, onChange:setSitemap }),
        React.createElement(TextInput, { key:"a", label:"Tillad (én pr. linje)", value:allow, onChange:setAllow, textarea:true, rows:4 }),
        React.createElement(TextInput, { key:"d", label:"Bloker (én pr. linje)", value:disallow, onChange:setDisallow, textarea:true, rows:6 }),
        React.createElement("div", { key:"b", className:"flex gap-2" }, [
          React.createElement(CopyButton, { key:"c", getText:()=>txt }),
          React.createElement(DownloadButton, { key:"dl", filename:"robots.txt", getContent:()=>txt })
        ])
      ]),
      React.createElement("div", { key:"r" },
        React.createElement("pre", { className:"bg-neutral-900 text-neutral-100 rounded-xl p-4 overflow-auto text-sm whitespace-pre-wrap" }, txt)
      )
    ])
  );
}

function SitemapXml() {
  const [base, setBase] = useState("https://www.seohub.dk");
  const [paths, setPaths] = useState("/\n/serp-preview.html\n/robots-generator.html\n/sitemap-generator.html");
  const [changefreq, setChangefreq] = useState("weekly");
  const [priority, setPriority] = useState("0.8");
  const xml = useMemo(() => {
    const list = paths.split(/\n+/).map(x=>x.trim()).filter(Boolean)
      .map(p => `${base.replace(/\/$/, "")}${p.startsWith("/") ? "" : "/"}${p}`);
    const items = list.map(loc => `  <url>\n    <loc>${loc}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`).join("\n");
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>`;
  }, [base, paths, changefreq, priority]);

  return React.createElement(Section, { title:"Sitemap.xml generator" },
    React.createElement("div", { className:"grid md:grid-cols-2 gap-6" }, [
      React.createElement("div", { key:"l" }, [
        React.createElement(TextInput, { key:"b", label:"Base URL", value:base, onChange:setBase }),
        React.createElement(TextInput, { key:"p", label:"Stier (én pr. linje)", value:paths, onChange:setPaths, textarea:true, rows:6 }),
        React.createElement("div", { key:"opts", className:"grid grid-cols-2 gap-3 mb-4" }, [
          React.createElement("label", { key:"cf", className:"block" }, [
            React.createElement("span", { className:"block text-sm font-medium mb-1" }, "changefreq"),
            React.createElement("select", { className:"w-full border rounded-xl p-3", value:changefreq, onChange:e=>setChangefreq(e.target.value) },
              ["always","hourly","daily","weekly","monthly","yearly","never"].map(x=> React.createElement("option", { key:x, value:x }, x))
            )
          ]),
          React.createElement(TextInput, { key:"pr", label:"priority (0.0–1.0)", value:priority, onChange:setPriority })
        ]),
        React.createElement("div", { key:"b2", className:"flex gap-2" }, [
          React.createElement(CopyButton, { key:"c", getText:()=>xml }),
          React.createElement(DownloadButton, { key:"dl", filename:"sitemap.xml", getContent:()=>xml })
        ])
      ]),
      React.createElement("div", { key:"r" },
        React.createElement("pre", { className:"bg-neutral-900 text-neutral-100 rounded-xl p-4 overflow-auto text-sm whitespace-pre" }, xml)
      )
    ])
  );
}

function FaqSchema() {
  const [pairs, setPairs] = useState([{ q: "Hvad er SEO?", a: "SEO står for søgemaskineoptimering." }]);
  const json = useMemo(() => {
    const mainEntity = pairs.filter(p=>p.q.trim() && p.a.trim()).map(p => ({"@type":"Question", name:p.q, acceptedAnswer:{"@type":"Answer", text:p.a}}));
    return JSON.stringify({ "@context":"https://schema.org", "@type":"FAQPage", mainEntity }, null, 2);
  }, [pairs]);

  return React.createElement(Section, { title:"FAQ schema (JSON-LD)" },
    React.createElement("div", { className:"space-y-4" }, [
      ...pairs.map((p,i)=>(
        React.createElement("div", { key:i, className:"grid md:grid-cols-2 gap-3" }, [
          React.createElement(TextInput, { key:"q", label:`Spørgsmål ${i+1}`, value:p.q, onChange:v=>{ const next=[...pairs]; next[i]={...next[i], q:v}; setPairs(next);} }),
          React.createElement(TextInput, { key:"a", label:`Svar ${i+1}`, value:p.a, onChange:v=>{ const next=[...pairs]; next[i]={...next[i], a:v}; setPairs(next); }, textarea:true, rows:2 })
        ])
      )),
      React.createElement("div", { key:"b", className:"flex gap-2" }, [
        React.createElement("button", { key:"add", className:"px-3 py-2 rounded-xl border", onClick:()=>setPairs([...pairs, {q:"", a:""}]) }, "tilføj"),
        React.createElement("button", { key:"rm", className:"px-3 py-2 rounded-xl border", onClick:()=>pairs.length>1 && setPairs(pairs.slice(0,-1)) }, "fjern sidste"),
        React.createElement(CopyButton, { key:"c", getText:()=>json })
      ]),
      React.createElement("pre", { key:"pre", className:"bg-neutral-900 text-neutral-100 rounded-xl p-4 overflow-auto text-sm whitespace-pre-wrap" }, json)
    ])
  );
}

function ContentBrief() {
  const [keyword, setKeyword] = useState("");
  const [audience, setAudience] = useState("begyndere");
  const brief = useMemo(() => {
    if (!keyword.trim()) return null;
    const k = keyword.trim();
    return {
      intent: ["informationssøgen (how/guide)","kommerciel research (bedst, pris)","transaktion (køb, tilbud)","lokal (nær mig/by)"],
      h2s: [`hvad er ${k}?`, `${k}: fordele/ulemper`, `${k} – trin for trin`, `typiske fejl i ${k}`, `faq om ${k}`],
      questions: [`hvordan kommer jeg i gang med ${k}?`, `hvad koster ${k}?`, `hvor lang tid tager ${k}?`, `kan jeg gøre ${k} selv?`, `alternativer til ${k}?`],
      intern: [`link til kategori om ${k}`, "link til relateret guide", "link til kontakt/tilbud"]
    };
  }, [keyword]);

  return React.createElement(Section, { title:"Content Brief (skelet)" },
    React.createElement("div", { className:"grid md:grid-cols-2 gap-6" }, [
      React.createElement("div", { key:"l" }, [
        React.createElement(TextInput, { key:"k", label:"Primært søgeord", value:keyword, onChange:setKeyword, placeholder:"fx 'lokal seo'" }),
        React.createElement(TextInput, { key:"a", label:"Målgruppe", value:audience, onChange:setAudience, placeholder:"fx 'små virksomheder'" }),
        brief ? React.createElement("div", { key:"b", className:"flex gap-2" }, [
          React.createElement(CopyButton, { key:"c", getText:()=>JSON.stringify({ keyword, audience, ...brief }, null, 2), label:"kopiér brief (json)" }),
          React.createElement(DownloadButton, { key:"d", filename:`brief-${keyword}.json`, getContent:()=>JSON.stringify({ keyword, audience, ...brief }, null, 2) })
        ]) : null
      ]),
      React.createElement("div", { key:"r", className:"space-y-4" },
        brief ? React.createElement(React.Fragment, null, [
          React.createElement(Card, { key:"i", title:"søgeintention" },
            React.createElement("ul", { className:"list-disc pl-5 text-sm space-y-1" }, brief.intent.map((x,i)=> React.createElement("li", { key:i }, x)))
          ),
          React.createElement(Card, { key:"h", title:"h2-forslag" },
            React.createElement("ul", { className:"list-disc pl-5 text-sm space-y-1" }, brief.h2s.map((x,i)=> React.createElement("li", { key:i }, x)))
          ),
          React.createElement(Card, { key:"q", title:"ofte stillede spørgsmål" },
            React.createElement("ul", { className:"list-disc pl-5 text-sm space-y-1" }, brief.questions.map((x,i)=> React.createElement("li", { key:i }, x)))
          ),
          React.createElement(Card, { key:"n", title:"interne links" },
            React.createElement("ul", { className:"list-disc pl-5 text-sm space-y-1" }, brief.intern.map((x,i)=> React.createElement("li", { key:i }, x)))
          ),
        ]) : React.createElement("p", { className:"text-sm text-neutral-600" }, "Skriv et søgeord for at generere et skelet.")
      )
    ])
  );
}

/* ---------- NYT: Seneste indlæg (auto fra /blog/posts.json) ---------- */
function LatestPosts() {
  const [posts, setPosts] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let alive = true;
    fetch("/blog/posts.json", { cache: "no-cache" })
      .then(r => r.ok ? r.json() : Promise.reject(new Error("Kunne ikke hente posts.json")))
      .then(data => {
        if (!alive) return;
        const sorted = [...data].sort((a,b) => (b.date || "").localeCompare(a.date || ""));
        setPosts(sorted.slice(0,3));
      })
      .catch(e => { if (alive) setErr(e.message || "Fejl"); });
    return () => { alive = false; };
  }, []);

  return React.createElement(Section, {
    title: "Seneste indlæg",
    description: "Nye guides og tjeklister fra bloggen."
  },
    err
      ? React.createElement("p", { className:"text-sm text-red-600" }, err)
      : !posts
        ? React.createElement("p", { className:"text-sm text-neutral-500" }, "Indlæser…")
        : React.createElement("div", { className:"grid md:grid-cols-3 gap-4" },
            posts.map(p => React.createElement(Card, {
              key:p.slug,
              title:p.title,
              description:p.excerpt,
              href:`/blog/${p.slug}.html`
            },
              React.createElement("div", { className:"text-xs text-neutral-500 mt-2" }, p.date)
            ))
          )
  );
}

/* ---------- Sponsorerede partnere (REN TEKST – ingen billeder) ---------- */
function Sponsors() {
  const items = [
    {
      name: "AI Links",
      href: "https://www.partner-ads.com/dk/klikbanner.php?partnerid=55078&bannerid=108555",
      tagline: "AI-drevet linkanalyse"
    },
    {
      name: "Nemlinkbuilding.dk",
      href: "https://www.partner-ads.com/dk/klikbanner.php?partnerid=55078&bannerid=87346",
      tagline: "Kvalitetslinks uden bøvl"
    },
    {
      name: "CLKWEB",
      href: "https://www.partner-ads.com/dk/klikbanner.php?partnerid=55078&bannerid=99810",
      tagline: "Teknisk SEO & udvikling"
    }
  ];
  return React.createElement(Section, { title:"Sponsoreret", description:"Udvalgte partnere vi anbefaler (reklame)." },
    React.createElement("div", { className:"grid sm:grid-cols-3 gap-4" },
      items.map(it =>
        React.createElement("a", {
          key: it.name,
          href: it.href,
          target:"_blank",
          rel:"sponsored noopener nofollow",
          className:"rounded-2xl border p-5 bg-white hover:shadow transition block"
        }, [
          React.createElement("div", { key:"name", className:"font-semibold text-base" }, it.name),
          React.createElement("div", { key:"tg", className:"text-sm text-neutral-600 mt-1" }, it.tagline),
          React.createElement("div", { key:"cta", className:"text-sm text-blue-700 mt-3" }, "Læs mere →")
        ])
      )
    )
  );
}

/* ---------- Stor blå hero + 3 ikon-kort (som før) ---------- */
function BigHero() {
  // simple inline “ikoner” (SVG) for de tre kort
  const IconDoc = React.createElement("svg", { className:"w-6 h-6", viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", strokeWidth:"2", strokeLinecap:"round", strokeLinejoin:"round" },
    React.createElement("path", { d:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }),
    React.createElement("polyline", { points:"14 2 14 8 20 8" })
  );
  const IconBot = React.createElement("svg", { className:"w-6 h-6", viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", strokeWidth:"2", strokeLinecap:"round", strokeLinejoin:"round" },
    React.createElement("rect", { x:"3", y:"11", width:"18", height:"10", rx:"2" }),
    React.createElement("circle", { cx:"12", cy:"5", r:"2" }),
    React.createElement("path", { d:"M12 7v4" })
  );
  const IconMap = React.createElement("svg", { className:"w-6 h-6", viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", strokeWidth:"2", strokeLinecap:"round", strokeLinejoin:"round" },
    React.createElement("polygon", { points:"2 6 9 3 15 6 22 3 22 18 15 21 9 18 2 21" }),
    React.createElement("line", { x1:"9", y1:"3", x2:"9", y2:"18" }),
    React.createElement("line", { x1:"15", y1:"6", x2:"15", y2:"21" })
  );

  return React.createElement("section", { className:"py-8 md:py-12" },
    React.createElement("div", { className:"max-w-6xl mx-auto px-4" }, [
      React.createElement("div", {
        key:"hero",
        className:"rounded-2xl p-10 md:p-14 text-white shadow-lg",
        style:{ background:"linear-gradient(135deg,#6366f1 0%,#3b82f6 50%,#06b6d4 100%)" }
      }, [
        React.createElement("p", { key:"k", className:"text-xs uppercase tracking-wider text-blue-100/90 mb-2" }, "Gratis SEO-værktøjer"),
        React.createElement("h1", { key:"h", className:"text-4xl md:text-5xl font-extrabold mb-3 leading-tight" }, "Seohub – hurtige værktøjer til hverdags-SEO"),
        React.createElement("p", { key:"p", className:"text-blue-100 text-lg md:text-xl max-w-3xl" },
          "SERP & meta, robots.txt, sitemap.xml, intern linkbuilder og flere små hjælperedskaber."
        )
      ]),
      React.createElement("div", { key:"grid", className:"grid md:grid-cols-3 gap-4 mt-6" }, [
        React.createElement(Card, {
          key:"serp",
          href:"/serp-preview.html",
          title:"SERP & Meta",
          description:"Forhåndsvisning + længde-tjek.",
          icon: IconDoc
        }, React.createElement("div", { className:"text-sm text-blue-700" }, "Åbn værktøj →")),
        React.createElement(Card, {
          key:"robots",
          href:"/robots-generator.html",
          title:"Robots.txt",
          description:"Byg og download.",
          icon: IconBot
        }, React.createElement("div", { className:"text-sm text-blue-700" }, "Åbn værktøj →")),
        React.createElement(Card, {
          key:"sitemap",
          href:"/sitemap-generator.html",
          title:"Sitemap.xml",
          description:"Generér fra URL-liste.",
          icon: IconMap
        }, React.createElement("div", { className:"text-sm text-blue-700" }, "Åbn værktøj →"))
      ])
    ])
  );
}

/* ---------- App ---------- */
function App() {
  return React.createElement("main", { className:"max-w-6xl mx-auto px-4 pb-12 space-y-8" }, [
    React.createElement(BigHero, { key:"hero" }),

    // Inline mini-værktøjer (som du kender dem)
    React.createElement(KeywordIdeas, { key:"kw" }),
    React.createElement(SerpAndMeta, { key:"serp" }),
    React.createElement(RobotsTxt, { key:"rob" }),
    React.createElement(SitemapXml, { key:"map" }),
    React.createElement(FaqSchema, { key:"faq" }),
    React.createElement(ContentBrief, { key:"brief" }),

    // Seneste indlæg (auto fra /blog/posts.json)
    React.createElement(LatestPosts, { key:"latest" }),

    // Sponsorerede partnere (ren tekst – ingen billeder)
    React.createElement(Sponsors, { key:"sponsors" })
  ]);
}

/* ---------- Mount ---------- */
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));
