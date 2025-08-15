// /app.js — stabil forside med stor blå hero, 3 ikon-kort og værktøjer
const { useState, useMemo } = React;

/* ---------- UI helpers ---------- */
function Section({ title, children, className="" }) {
  return React.createElement(
    "section",
    { className: `bg-white/70 backdrop-blur rounded-2xl shadow p-6 border border-neutral-100 my-8 ${className}`.trim() },
    [
      title
        ? React.createElement("h2", { key: "h", className: "text-xl font-semibold mb-4" }, title)
        : null,
      children,
    ]
  );
}
function Card({ title, description, children, href, icon }) {
  const content = [
    (title || description)
      ? React.createElement(
          "div",
          { key: "hd", className: "mb-3" },
          [
            title ? React.createElement("h3", { key: "t", className: "text-lg font-semibold leading-tight" }, title) : null,
            description ? React.createElement("p", { key: "d", className: "text-sm text-neutral-600 mt-1" }, description) : null,
          ]
        )
      : null,
    children,
  ];
  const base = React.createElement(
    "div",
    { className: "rounded-2xl border p-4 shadow-sm bg-white hover:shadow transition" },
    content
  );
  if (href) {
    return React.createElement(
      "a",
      { href, className: "block focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-2xl" },
      [
        icon ? React.createElement("div", { key:"i", className:"mb-3" }, icon) : null,
        base
      ]
    );
  }
  return base;
}
function TextInput({ label, value, onChange, placeholder, textarea=false, rows=3 }) {
  return React.createElement(
    "label",
    { className: "block mb-3" },
    [
      label ? React.createElement("span", { key: "l", className: "block text-sm font-medium mb-1" }, label) : null,
      textarea
        ? React.createElement("textarea", { key: "ta", value, onChange: e=>onChange(e.target.value), placeholder, rows, className: "w-full border rounded-xl p-3 focus:outline-none focus:ring focus:ring-indigo-200" })
        : React.createElement("input", { key: "in", value, onChange: e=>onChange(e.target.value), placeholder, className: "w-full border rounded-xl p-3 focus:outline-none focus:ring focus:ring-indigo-200" })
    ]
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
      } catch(e) { alert("Kunne ikke kopiere. Markér og kopier manuelt."); }
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
      a.href = url; a.download = filename; a.click();
      URL.revokeObjectURL(url);
    },
    className: "px-3 py-2 rounded-xl text-sm border bg-neutral-50 hover:bg-neutral-100"
  }, label);
}

/* ---------- Hero ---------- */
function Hero() {
  return React.createElement("section", { className: "py-10 md:py-14" },
    React.createElement("div", { className: "max-w-6xl mx-auto px-4" },
      React.createElement("div", {
        className: "rounded-2xl p-12 md:p-20 text-white shadow-lg",
        style: "background:linear-gradient(135deg,#6366f1 0%,#3b82f6 50%,#06b6d4 100%)"
      }, [
        React.createElement("h1", { key:"h", className:"text-4xl md:text-6xl font-extrabold mb-4 leading-tight" }, "Gratis SEO værktøjer"),
        React.createElement("p", { key:"p", className:"text-blue-100 text-lg md:text-xl max-w-3xl mb-8" },
          "Vælg et værktøj – ingen login, ingen installation."),
        // 3 klikbare ikonkort
        React.createElement("div", { key:"g", className:"grid grid-cols-1 sm:grid-cols-3 gap-5" }, [
          React.createElement("a", { key:"serp", href:"/serp-preview.html", className:"block px-6 py-5 rounded-2xl bg-white/10 shadow-lg hover:bg-white/15 transition focus:outline-none focus:ring-2 focus:ring-white/60" }, [
            React.createElement("div", { key:"i", className:"mb-2" },
              React.createElement("svg", { className:"w-7 h-7 text-white", fill:"none", stroke:"currentColor", strokeWidth:"1.8", strokeLinecap:"round", strokeLinejoin:"round", viewBox:"0 0 24 24" },
                React.createElement("path", { d:"M21 21l-4.35-4.35M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" })
              )
            ),
            React.createElement("div", { key:"t", className:"font-semibold" }, "SERP & Meta"),
            React.createElement("div", { key:"d", className:"text-blue-100 text-sm" }, "Forhåndsvisning + længde-tjek")
          ]),
          React.createElement("a", { key:"robots", href:"/robots-generator.html", className:"block px-6 py-5 rounded-2xl bg-white/10 shadow-lg hover:bg-white/15 transition focus:outline-none focus:ring-2 focus:ring-white/60" }, [
            React.createElement("div", { key:"i", className:"mb-2" },
              React.createElement("svg", { className:"w-7 h-7 text-white", fill:"none", stroke:"currentColor", strokeWidth:"1.8", strokeLinecap:"round", strokeLinejoin:"round", viewBox:"0 0 24 24" },
                React.createElement("path", { d:"M12 2v4m0 12v4M2 12h4m12 0h4M7 7l10 10M17 7L7 17" })
              )
            ),
            React.createElement("div", { key:"t", className:"font-semibold" }, "Robots.txt"),
            React.createElement("div", { key:"d", className:"text-blue-100 text-sm" }, "Byg og download")
          ]),
          React.createElement("a", { key:"sitemap", href:"/sitemap-generator.html", className:"block px-6 py-5 rounded-2xl bg-white/10 shadow-lg hover:bg-white/15 transition focus:outline-none focus:ring-2 focus:ring-white/60" }, [
            React.createElement("div", { key:"i", className:"mb-2" },
              React.createElement("svg", { className:"w-7 h-7 text-white", fill:"none", stroke:"currentColor", strokeWidth:"1.8", strokeLinecap:"round", strokeLinejoin:"round", viewBox:"0 0 24 24" },
                React.createElement("path", { d:"M4 6h16M4 12h10M4 18h7" })
              )
            ),
            React.createElement("div", { key:"t", className:"font-semibold" }, "Sitemap.xml"),
            React.createElement("div", { key:"d", className:"text-blue-100 text-sm" }, "Generér fra liste af URLs")
          ]),
        ])
      ])
    )
  );
}

/* ---------- Værktøjer ---------- */
function KeywordIdeas() {
  const [seed, setSeed] = useState("");
  const ideas = useMemo(() => {
    if (!seed.trim()) return [];
    const s = seed.trim().toLowerCase();
    const prefixes = ["bedste","billig","guide til","hvordan","tjekliste","tips til","kritiske fejl i","idéer til","trin for trin","2025"];
    const suffixes = ["pris","eksempler","skabelon","værktøjer","for begyndere","for små virksomheder","lokal seo","teknisk seo","content","linkbuilding"];
    const variants = new Set();
    prefixes.forEach(p=>variants.add(`${p} ${s}`));
    suffixes.forEach(x=>variants.add(`${s} ${x}`));
    ["nær mig","gratis","hurtigt","avanceret","eksempel","skema"].forEach(m=>variants.add(`${s} ${m}`));
    return Array.from(variants).slice(0, 60);
  }, [seed]);

  return React.createElement(Section, { title: "Nøgleordsidéer (hurtig)" },
    React.createElement("div", { className: "grid md:grid-cols-3 gap-4" }, [
      React.createElement("div", { key:"l", className: "md:col-span-1" }, [
        React.createElement(TextInput, { key:"seed", label: "Emne/seed", value: seed, onChange: setSeed, placeholder: "fx 'seo' eller 'kapselkaffe'" }),
        React.createElement("div", { key:"btns", className: "flex gap-2" },
          [
            React.createElement(CopyButton, { key:"c", getText: ()=>ideas.join("\n") }),
            React.createElement(DownloadButton, { key:"d", filename: `keywords-${seed || 'seed'}.txt`, getContent: ()=>ideas.join("\n") })
          ]
        )
      ]),
      React.createElement("div", { key:"r", className: "md:col-span-2" },
        React.createElement("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-3" },
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

  return React.createElement(Section, { title: "SERP preview & title/meta tjek" },
    React.createElement("div", { className: "grid md:grid-cols-2 gap-6" }, [
      React.createElement(Card, { key:"form", title:"Indtast oplysninger", description:"Skriv titel og metabeskrivelse – få længdeindikatorer i realtime" },
        [
          React.createElement(TextInput, { key:"t", label:"Titel (50–60 tegn)", value:title, onChange:setTitle, placeholder:"fx: seohub – den komplette guide (2025)" }),
          React.createElement(TextInput, { key:"u", label:"URL", value:url, onChange:setUrl }),
          React.createElement(TextInput, { key:"d", label:"Metabeskrivelse (140–160 tegn)", value:desc, onChange:setDesc, textarea:true, rows:4 }),
          React.createElement("div", { key:"badges", className:"flex items-center gap-3 text-sm" }, [
            React.createElement("span", { key:"tb", className:`px-2 py-1 rounded-full ${okT ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}` }, `titel: ${tl} tegn`),
            React.createElement("span", { key:"db", className:`px-2 py-1 rounded-full ${okD ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}` }, `meta: ${dl} tegn`),
            React.createElement(CopyButton, { key:"ct", label:"kopiér title", getText: ()=>title }),
            React.createElement(CopyButton, { key:"cd", label:"kopiér description", getText: ()=>desc }),
          ])
        ]
      ),
      React.createElement(Card, { key:"prev", title:"Google-lignende forhåndsvisning", description:"Simuleret visning – ikke 1:1 med virkelige pixelbredder" },
        React.createElement("div", { className: "rounded-xl border p-4 bg-white" }, [
          React.createElement("div", { key:"pt", className: "text-[#1a0dab] text-xl leading-snug truncate" }, title || "Din titel vises her"),
          React.createElement("div", { key:"pu", className: "text-[#006621] text-sm mt-1 truncate" }, url),
          React.createElement("div", { key:"pd", className: "text-[#545454] text-sm mt-1" }, desc || "Skriv en præcis metabeskrivelse, der matcher søgeintentionen og inkluderer primært søgeord + USP.")
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

  return React.createElement(Section, { title: "Robots.txt generator" },
    React.createElement("div", { className: "grid md:grid-cols-2 gap-6" }, [
      React.createElement("div", { key:"l" }, [
        React.createElement(TextInput, { key:"s", label:"Sitemap URL", value:sitemap, onChange:setSitemap }),
        React.createElement(TextInput, { key:"a", label:"Tillad (én pr. linje)", value:allow, onChange:setAllow, textarea:true, rows:4 }),
        React.createElement(TextInput, { key:"d", label:"Bloker (én pr. linje)", value:disallow, onChange:setDisallow, textarea:true, rows:6 }),
        React.createElement("div", { key:"b", className:"flex gap-2" }, [
          React.createElement(CopyButton, { key:"c", getText: ()=>txt }),
          React.createElement(DownloadButton, { key:"dl", filename:"robots.txt", getContent: ()=>txt })
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

  return React.createElement(Section, { title: "Sitemap.xml generator" },
    React.createElement("div", { className:"grid md:grid-cols-2 gap-6" }, [
      React.createElement("div", { key:"l" }, [
        React.createElement(TextInput, { key:"b", label:"Base URL", value:base, onChange:setBase }),
        React.createElement(TextInput, { key:"p", label:"Stier (én pr. linje)", value:paths, onChange:setPaths, textarea:true, rows:6 }),
        React.createElement("div", { key:"opts", className:"grid grid-cols-2 gap-3 mb-4" }, [
          React.createElement("label", { key:"cf", className:"block" },
            React.createElement("span", { className:"block text-sm font-medium mb-1" }, "changefreq"),
            React.createElement("select", { className:"w-full border rounded-xl p-3", value:changefreq, onChange:e=>setChangefreq(e.target.value) },
              ["always","hourly","daily","weekly","monthly","yearly","never"].map(x => React.createElement("option", { key: x, value: x }, x))
            )
          ),
          React.createElement(TextInput, { key:"pr", label:"priority (0.0–1.0)", value:priority, onChange:setPriority })
        ]),
        React.createElement("div", { key:"b2", className:"flex gap-2" }, [
          React.createElement(CopyButton, { key:"c", getText: ()=>xml }),
          React.createElement(DownloadButton, { key:"dl", filename:"sitemap.xml", getContent: ()=>xml })
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
    const mainEntity = pairs.filter(p=>p.q.trim() && p.a.trim()).map(p => ({"@type":"Question", name: p.q, acceptedAnswer: {"@type":"Answer", text: p.a}}));
    return JSON.stringify({ "@context":"https://schema.org", "@type":"FAQPage", mainEntity }, null, 2);
  }, [pairs]);

  return React.createElement(Section, { title: "FAQ schema (JSON-LD)" },
    React.createElement("div", { className:"space-y-4" }, [
      ...pairs.map((p,i)=>(
        React.createElement("div", { key:i, className:"grid md:grid-cols-2 gap-3" }, [
          React.createElement(TextInput, { key:"q", label:`Spørgsmål ${i+1}`, value:p.q, onChange: v=>{ const next=[...pairs]; next[i]={...next[i], q:v}; setPairs(next);} }),
          React.createElement(TextInput, { key:"a", label:`Svar ${i+1}`, value:p.a, onChange: v=>{ const next=[...pairs]; next[i]={...next[i], a:v}; setPairs(next); }, textarea:true, rows:2 })
        ])
      )),
      React.createElement("div", { key:"b", className:"flex gap-2" }, [
        React.createElement("button", { key:"add", className:"px-3 py-2 rounded-xl border", onClick: ()=>setPairs([...pairs, {q:"", a:""}]) }, "tilføj"),
        React.createElement("button", { key:"rm", className:"px-3 py-2 rounded-xl border", onClick: ()=>pairs.length>1 && setPairs(pairs.slice(0,-1)) }, "fjern sidste"),
        React.createElement(CopyButton, { key:"c", getText: ()=>json }),
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
      intent: [
        "informationssøgen (how/guide)",
        "kommerciel research (bedst, top, pris)",
        "transaktion (køb, tilbud)",
        "lokal (nær mig, bynavn)",
      ],
      h2s: [
        `hvad er ${k}?`,
        `${k}: fordele og ulemper`,
        `${k} – trin for trin`,
        `typiske fejl i ${k} (og løsninger)`,
        `faq om ${k}`,
      ],
      questions: [
        `hvordan kommer jeg i gang med ${k}?`,
        `hvor lang tid tager ${k}?`,
        `hvad koster ${k}?`,
        `kan jeg gøre ${k} selv?`,
        `hvad er alternativer til ${k}?`,
      ],
      intern: [
        `link til kategori om ${k}`,
        `link til relateret guide`,
        `link til kontakt/tilbud`,
      ],
    };
  }, [keyword]);

  return React.createElement(Section, { title: "Content Brief (skelet)" },
    React.createElement("div", { className:"grid md:grid-cols-2 gap-6" }, [
      React.createElement("div", { key:"l" }, [
        React.createElement(TextInput, { key:"k", label:"Primært søgeord", value:keyword, onChange:setKeyword, placeholder:"fx 'lokal seo'" }),
        React.createElement(TextInput, { key:"a", label:"Målgruppe", value:audience, onChange:setAudience, placeholder:"fx 'små virksomheder'" }),
        brief ? React.createElement("div", { key:"b", className:"flex gap-2" }, [
          React.createElement(CopyButton, { key:"c", getText: ()=>JSON.stringify({ keyword, audience, ...brief }, null, 2), label:"kopiér brief (json)" }),
          React.createElement(DownloadButton, { key:"d", filename:`brief-${keyword}.json`, getContent: ()=>JSON.stringify({ keyword, audience, ...brief }, null, 2) })
        ]) : null
      ]),
      React.createElement("div", { key:"r", className:"space-y-4" },
        brief
          ? React.createElement(React.Fragment, null, [
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
              )
            ])
          : React.createElement("p", { className:"text-sm text-neutral-600" }, "Skriv et søgeord for at generere et skelet.")
      )
    ])
  );
}

/* ---------- Kontaktformular ---------- */
function ContactForm() {
  return React.createElement(Section, { title: "Kontakt os" },
    React.createElement("form", {
      action: "https://formspree.io/f/mjkolqrk",
      method: "POST",
      className: "space-y-4"
    }, [
      React.createElement("label", { key:"name", className:"block mb-3" }, [
        React.createElement("span", { className:"block text-sm font-medium mb-1" }, "Navn"),
        React.createElement("input", { name:"name", required:true, className:"w-full border rounded-xl p-3 focus:outline-none focus:ring focus:ring-indigo-200", placeholder:"Dit navn" })
      ]),
      React.createElement("label", { key:"email", className:"block mb-3" }, [
        React.createElement("span", { className:"block text-sm font-medium mb-1" }, "E-mail"),
        React.createElement("input", { type:"email", name:"_replyto", required:true, className:"w-full border rounded-xl p-3 focus:outline-none focus:ring focus:ring-indigo-200", placeholder:"din@email.dk" })
      ]),
      React.createElement("label", { key:"msg", className:"block mb-3" }, [
        React.createElement("span", { className:"block text-sm font-medium mb-1" }, "Besked"),
        React.createElement("textarea", { name:"message", rows:5, required:true, className:"w-full border rounded-xl p-3 focus:outline-none focus:ring focus:ring-indigo-200", placeholder:"Skriv din besked her..." })
      ]),
      React.createElement("button", { key:"btn", type:"submit", className:"px-4 py-2 rounded-2xl text-white bg-blue-600 hover:bg-blue-700" }, "Send")
    ])
  );
}

/* ---------- App ---------- */
function App() {
  return React.createElement("main", { className: "max-w-6xl mx-auto p-4 space-y-8" }, [
    React.createElement(Hero, { key:"hero" }),

    // Hurtige genveje (gøres pæne med Card-link)
    React.createElement("section", { key:"grid", className:"grid md:grid-cols-3 gap-4" }, [
      React.createElement(Card, {
        key:"k1",
        href:"/serp-preview.html",
        title:"SERP & Meta",
        description:"Forhåndsvisning + længde-tjek",
        icon: React.createElement("div", { className:"w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center mb-2" }, "A")
      }),
      React.createElement(Card, {
        key:"k2",
        href:"/robots-generator.html",
        title:"Robots.txt",
        description:"Byg og download",
        icon: React.createElement("div", { className:"w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center mb-2" }, "R")
      }),
      React.createElement(Card, {
        key:"k3",
        href:"/sitemap-generator.html",
        title:"Sitemap.xml",
        description:"Generér fra liste af URLs",
        icon: React.createElement("div", { className:"w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center mb-2" }, "S")
      }),
    ]),

    // Inline tools
    React.createElement(KeywordIdeas, { key:"kw" }),
    React.createElement(SerpAndMeta, { key:"serp" }),
    React.createElement(RobotsTxt, { key:"rob" }),
    React.createElement(SitemapXml, { key:"map" }),
    React.createElement(FaqSchema, { key:"faq" }),
    React.createElement(ContentBrief, { key:"brief" }),

    // Kontakt
    React.createElement(ContactForm, { key:"contact" })
  ]);
}

/* ---------- Mount ---------- */
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));
