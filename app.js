// /app.js — Seohub: stor blå hero (3 ikoner) + sponsorerede samarbejdspartnere (logoer) + alle værktøjer + kontakt
const { createElement: h, useState, useMemo, useRef, useEffect } = React;

/* ---------- UI helpers ---------- */
function Section({ title, children, className="" }) {
  return h(
    "section",
    { className: `bg-white/70 backdrop-blur rounded-2xl shadow p-6 border border-neutral-100 my-8 ${className}`.trim() },
    [
      title ? h("h2", { key:"h", className:"text-xl font-semibold mb-4" }, title) : null,
      children
    ]
  );
}
function TextInput({ label, value, onChange, placeholder, textarea=false, rows=3 }) {
  return h("label", { className:"block mb-3" }, [
    label ? h("span", { key:"l", className:"block text-sm font-medium mb-1" }, label) : null,
    textarea
      ? h("textarea", { key:"ta", value, onChange:e=>onChange(e.target.value), placeholder, rows, className:"w-full border rounded-xl p-3 focus:outline-none focus:ring focus:ring-indigo-200" })
      : h("input", { key:"in", value, onChange:e=>onChange(e.target.value), placeholder, className:"w-full border rounded-xl p-3 focus:outline-none focus:ring focus:ring-indigo-200" })
  ]);
}
function CopyButton({ getText, label="Kopiér" }) {
  const [copied, setCopied] = useState(false);
  return h("button", {
    onClick: async () => {
      try { await navigator.clipboard.writeText(getText()); setCopied(true); setTimeout(()=>setCopied(false), 1500); }
      catch { alert("Kunne ikke kopiere. Markér og kopier manuelt."); }
    },
    className:"px-3 py-2 rounded-xl text-sm border bg-neutral-50 hover:bg-neutral-100"
  }, copied ? "Kopieret!" : label);
}
function DownloadButton({ filename, getContent, label="Download" }) {
  return h("button", {
    onClick: () => {
      const blob = new Blob([getContent()], { type:"text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
      URL.revokeObjectURL(url);
    },
    className:"px-3 py-2 rounded-xl text-sm border bg-neutral-50 hover:bg-neutral-100"
  }, label);
}

/* ---------- HERO (3 klikbare ikoner) ---------- */
function Hero() {
  return h("section", { className:"py-10 md:py-14" },
    h("div", { className:"max-w-6xl mx-auto px-4" },
      h("div", {
        className:"rounded-2xl p-12 md:p-20 text-white shadow-lg",
        style:{ background:"linear-gradient(135deg,#6366f1 0%,#3b82f6 50%,#06b6d4 100%)" }
      }, [
        h("h1", { key:"h", className:"text-4xl md:text-6xl font-extrabold mb-4 leading-tight" }, "Gratis SEO værktøjer"),
        h("p", { key:"p", className:"text-blue-100 text-lg md:text-xl max-w-3xl mb-8" }, "Vælg et værktøj – ingen login, ingen installation."),
        h("div", { key:"g", className:"grid grid-cols-1 sm:grid-cols-3 gap-5" }, [
          h("a", { key:"serp", href:"/serp-preview.html", className:"block px-6 py-5 rounded-2xl bg-white/10 shadow-lg hover:bg-white/15 transition focus:outline-none focus:ring-2 focus:ring-white/60" }, [
            h("div", { key:"i", className:"mb-2" },
              h("svg", { className:"w-7 h-7 text-white", fill:"none", stroke:"currentColor", strokeWidth:"1.8", strokeLinecap:"round", strokeLinejoin:"round", viewBox:"0 0 24 24" },
                h("path", { d:"M21 21l-4.35-4.35M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" })
              )
            ),
            h("div", { key:"t", className:"font-semibold" }, "SERP & Meta"),
            h("div", { key:"d", className:"text-blue-100 text-sm" }, "Forhåndsvisning + længde-tjek")
          ]),
          h("a", { key:"robots", href:"/robots-generator.html", className:"block px-6 py-5 rounded-2xl bg-white/10 shadow-lg hover:bg-white/15 transition focus:outline-none focus:ring-2 focus:ring-white/60" }, [
            h("div", { key:"i", className:"mb-2" },
              h("svg", { className:"w-7 h-7 text-white", fill:"none", stroke:"currentColor", strokeWidth:"1.8", strokeLinecap:"round", strokeLinejoin:"round", viewBox:"0 0 24 24" },
                h("path", { d:"M12 2v4m0 12v4M2 12h4m12 0h4M7 7l10 10M17 7L7 17" })
              )
            ),
            h("div", { key:"t", className:"font-semibold" }, "Robots.txt"),
            h("div", { key:"d", className:"text-blue-100 text-sm" }, "Byg og download")
          ]),
          h("a", { key:"sitemap", href:"/sitemap-generator.html", className:"block px-6 py-5 rounded-2xl bg-white/10 shadow-lg hover:bg-white/15 transition focus:outline-none focus:ring-2 focus:ring-white/60" }, [
            h("div", { key:"i", className:"mb-2" },
              h("svg", { className:"w-7 h-7 text-white", fill:"none", stroke:"currentColor", strokeWidth:"1.8", strokeLinecap:"round", strokeLinejoin:"round", viewBox:"0 0 24 24" },
                h("path", { d:"M4 6h16M4 12h10M4 18h7" })
              )
            ),
            h("div", { key:"t", className:"font-semibold" }, "Sitemap.xml"),
            h("div", { key:"d", className:"text-blue-100 text-sm" }, "Generér fra liste af URLs")
          ])
        ])
      ])
    )
  );
}

/* ---------- Partnersektion (Sponsorerede samarbejdspartnere m. logoer) ---------- */
function PartnersSection() {
  const partners = [
    {
      name: "AI Links",
      href: "https://www.partner-ads.com/dk/klikbanner.php?partnerid=55078&bannerid=108555",
      tagline: "AI-drevne backlinks – smartere linkbuilding til SEO.",
      logo: "/assets/logos/ai-links.png"
    },
    {
      name: "Nemlinkbuilding.dk",
      href: "https://www.partner-ads.com/dk/klikbanner.php?partnerid=55078&bannerid=87346",
      tagline: "Kvalitetslinks uden bøvl – nem bestilling og hurtig levering.",
      logo: "/assets/logos/nemlinkbuilding.png"
    },
    {
      name: "CLKWEB",
      href: "https://www.partner-ads.com/dk/klikbanner.php?partnerid=55078&bannerid=99810",
      tagline: "E-commerce & Magento-eksperter – få en shop der performer.",
      logo: "/assets/logos/clkweb.png"
    }
  ];

  // fallback hvis et logo fejler: skjul billedet og vis initialer
  const Logo = ({ src, alt }) => {
    const imgRef = useRef(null);
    const [err, setErr] = useState(false);
    useEffect(()=>{ setErr(false); }, [src]);
    return err
      ? h("span", { className:"mx-auto mb-3 inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-600 text-white font-semibold" },
          (alt||"").split(/\s|-/).map(s=>s[0]?.toUpperCase()).filter(Boolean).slice(0,3).join('') || "SE")
      : h("img", {
          ref: imgRef,
          src, alt,
          className:"mx-auto mb-3 h-12 object-contain",
          loading:"lazy",
          onError:()=>setErr(true)
        });
  };

  return h("section", { className:"max-w-6xl mx-auto px-4" },
    h("div", { className:"bg-white/70 backdrop-blur rounded-2xl shadow p-6 md:p-8 border border-neutral-100" }, [
      h("h2", { key:"h", className:"text-2xl font-bold mb-6 text-center" }, "Sponsorerede samarbejdspartnere"),
      h("div", { key:"g", className:"grid grid-cols-1 md:grid-cols-3 gap-6" },
        partners.map((p,i)=>
          h("div", { key:i, className:"border rounded-2xl shadow hover:shadow-lg transition p-5 text-center" }, [
            h("span", { className:"text-[11px] uppercase tracking-wide text-neutral-500 block mb-2" }, "Sponsoreret"),
            h("a", { href:p.href, target:"_blank", rel:"sponsored noopener", className:"block focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-xl p-2" }, [
              h(Logo, { src:p.logo, alt:p.name }),
              h("h3", { className:"text-lg font-semibold mb-1" }, p.name),
              h("p", { className:"text-sm text-neutral-600" }, p.tagline)
            ])
          ])
        )
      )
    ])
  );
}

/* ---------- Tools ---------- */
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

  return h(Section, { title:"Nøgleordsidéer (hurtig)" },
    h("div", { className:"grid md:grid-cols-3 gap-4" }, [
      h("div", { key:"l", className:"md:col-span-1" }, [
        h(TextInput, { key:"seed", label:"Emne/seed", value:seed, onChange:setSeed, placeholder:"fx 'seo' eller 'kapselkaffe'" }),
        h("div", { key:"btns", className:"flex gap-2" }, [
          h(CopyButton, { key:"c", getText:()=>ideas.join("\n") }),
          h(DownloadButton, { key:"d", filename:`keywords-${seed || 'seed'}.txt`, getContent:()=>ideas.join("\n") })
        ])
      ]),
      h("div", { key:"r", className:"md:col-span-2" },
        h("div", { className:"grid sm:grid-cols-2 lg:grid-cols-3 gap-3" },
          ideas.map((k,i)=> h("div", { key:i, className:"border rounded-xl p-3 text-sm bg-neutral-50" }, k))
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

  return h(Section, { title:"SERP preview & title/meta tjek" },
    h("div", { className:"grid md:grid-cols-2 gap-6" }, [
      h("div", { key:"form", className:"rounded-2xl border p-4 shadow-sm bg-white" }, [
        h(TextInput, { key:"t", label:"Titel (50–60 tegn)", value:title, onChange:setTitle, placeholder:"fx: seohub – den komplette guide (2025)" }),
        h(TextInput, { key:"u", label:"URL", value:url, onChange:setUrl }),
        h(TextInput, { key:"d", label:"Metabeskrivelse (140–160 tegn)", value:desc, onChange:setDesc, textarea:true, rows:4 }),
        h("div", { key:"badges", className:"flex items-center gap-3 text-sm" }, [
          h("span", { key:"tb", className:`px-2 py-1 rounded-full ${okT ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}` }, `titel: ${tl} tegn`),
          h("span", { key:"db", className:`px-2 py-1 rounded-full ${okD ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}` }, `meta: ${dl} tegn`),
          h(CopyButton, { key:"ct", label:"kopiér title", getText:()=>title }),
          h(CopyButton, { key:"cd", label:"kopiér description", getText:()=>desc })
        ])
      ]),
      h("div", { key:"prev", className:"rounded-2xl border p-4 shadow-sm bg-white" }, [
        h("div", { key:"pt", className:"text-[#1a0dab] text-xl leading-snug truncate" }, title || "Din titel vises her"),
        h("div", { key:"pu", className:"text-[#006621] text-sm mt-1 truncate" }, url),
        h("div", { key:"pd", className:"text-[#545454] text-sm mt-1" }, desc || "Skriv en præcis metabeskrivelse, der matcher søgeintentionen og inkluderer primært søgeord + USP.")
      ])
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

  return h(Section, { title:"Robots.txt generator" },
    h("div", { className:"grid md:grid-cols-2 gap-6" }, [
      h("div", { key:"l" }, [
        h(TextInput, { key:"s", label:"Sitemap URL", value:sitemap, onChange:setSitemap }),
        h(TextInput, { key:"a", label:"Tillad (én pr. linje)", value:allow, onChange:setAllow, textarea:true, rows:4 }),
        h(TextInput, { key:"d", label:"Bloker (én pr. linje)", value:disallow, onChange:setDisallow, textarea:true, rows:6 }),
        h("div", { key:"b", className:"flex gap-2" }, [
          h(CopyButton, { key:"c", getText:()=>txt }),
          h(DownloadButton, { key:"dl", filename:"robots.txt", getContent:()=>txt })
        ])
      ]),
      h("div", { key:"r" },
        h("pre", { className:"bg-neutral-900 text-neutral-100 rounded-xl p-4 overflow-auto text-sm whitespace-pre-wrap" }, txt)
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

  return h(Section, { title:"Sitemap.xml generator" },
    h("div", { className:"grid md:grid-cols-2 gap-6" }, [
      h("div", { key:"l" }, [
        h(TextInput, { key:"b", label:"Base URL", value:base, onChange:setBase }),
        h(TextInput, { key:"p", label:"Stier (én pr. linje)", value:paths, onChange:setPaths, textarea:true, rows:6 }),
        h("div", { key:"opts", className:"grid grid-cols-2 gap-3 mb-4" }, [
          h("label", { key:"cf", className:"block" }, [
            h("span", { className:"block text-sm font-medium mb-1" }, "changefreq"),
            h("select", { className:"w-full border rounded-xl p-3", value:changefreq, onChange:e=>setChangefreq(e.target.value) },
              ["always","hourly","daily","weekly","monthly","yearly","never"].map(x => h("option", { key:x, value:x }, x))
            )
          ]),
          h(TextInput, { key:"pr", label:"priority (0.0–1.0)", value:priority, onChange:setPriority })
        ]),
        h("div", { key:"b2", className:"flex gap-2" }, [
          h(CopyButton, { key:"c", getText:()=>xml }),
          h(DownloadButton, { key:"dl", filename:"sitemap.xml", getContent:()=>xml })
        ])
      ]),
      h("div", { key:"r" },
        h("pre", { className:"bg-neutral-900 text-neutral-100 rounded-xl p-4 overflow-auto text-sm whitespace-pre" }, xml)
      )
    ])
  );
}

function FaqSchema() {
  const [pairs, setPairs] = useState([{ q:"Hvad er SEO?", a:"SEO står for søgemaskineoptimering." }]);
  const json = useMemo(() => {
    const mainEntity = pairs.filter(p=>p.q.trim() && p.a.trim()).map(p => ({
      "@type":"Question", name:p.q, acceptedAnswer:{ "@type":"Answer", text:p.a }
    }));
    return JSON.stringify({ "@context":"https://schema.org", "@type":"FAQPage", mainEntity }, null, 2);
  }, [pairs]);

  return h(Section, { title:"FAQ schema (JSON-LD)" },
    h("div", { className:"space-y-4" }, [
      ...pairs.map((p,i)=> h("div", { key:i, className:"grid md:grid-cols-2 gap-3" }, [
        h(TextInput, { key:"q", label:`Spørgsmål ${i+1}`, value:p.q, onChange:v=>{ const n=[...pairs]; n[i]={...n[i], q:v}; setPairs(n);} }),
        h(TextInput, { key:"a", label:`Svar ${i+1}`, value:p.a, onChange:v=>{ const n=[...pairs]; n[i]={...n[i], a:v}; setPairs(n); }, textarea:true, rows:2 })
      ])),
      h("div", { key:"b", className:"flex gap-2" }, [
        h("button", { key:"add", className:"px-3 py-2 rounded-xl border", onClick:()=>setPairs([...pairs, {q:"", a:""}]) }, "tilføj"),
        h("button", { key:"rm", className:"px-3 py-2 rounded-xl border", onClick:()=>pairs.length>1 && setPairs(pairs.slice(0,-1)) }, "fjern sidste"),
        h(CopyButton, { key:"c", getText:()=>json })
      ]),
      h("pre", { key:"pre", className:"bg-neutral-900 text-neutral-100 rounded-xl p-4 overflow-auto text-sm whitespace-pre-wrap" }, json)
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
      intent: ["informationssøgen (how/guide)","kommerciel research (bedst, top, pris)","transaktion (køb, tilbud)","lokal (nær mig, bynavn)"],
      h2s: [`hvad er ${k}?`, `${k}: fordele og ulemper`, `${k} – trin for trin`, `typiske fejl i ${k} (og løsninger)`, `faq om ${k}`],
      questions: [`hvordan kommer jeg i gang med ${k}?`, `hvor lang tid tager ${k}?`, `hvad koster ${k}?`, `kan jeg gøre ${k} selv?`, `hvad er alternativer til ${k}?`],
      intern: [`link til kategori om ${k}`, `link til relateret guide`, `link til kontakt/tilbud`]
    };
  }, [keyword]);

  return h(Section, { title:"Content Brief (skelet)" },
    h("div", { className:"grid md:grid-cols-2 gap-6" }, [
      h("div", { key:"l" }, [
        h(TextInput, { key:"k", label:"Primært søgeord", value:keyword, onChange:setKeyword, placeholder:"fx 'lokal seo'" }),
        h(TextInput, { key:"a", label:"Målgruppe", value:audience, onChange:setAudience, placeholder:"fx 'små virksomheder'" }),
        brief ? h("div", { key:"b", className:"flex gap-2" }, [
          h(CopyButton, { key:"c", getText:()=>JSON.stringify({ keyword, audience, ...brief }, null, 2), label:"kopiér brief (json)" }),
          h(DownloadButton, { key:"d", filename:`brief-${keyword}.json`, getContent:()=>JSON.stringify({ keyword, audience, ...brief }, null, 2) })
        ]) : null
      ]),
      h("div", { key:"r", className:"space-y-4" },
        brief
          ? h(React.Fragment, null, [
              h("div", { key:"i", className:"rounded-2xl border p-4 shadow-sm bg-white" },
                h("h3", { className:"font-semibold mb-2" }, "søgeintention"),
                h("ul", { className:"list-disc pl-5 text-sm space-y-1" }, brief.intent.map((x,i)=> h("li", { key:i }, x)))
              ),
              h("div", { key:"h", className:"rounded-2xl border p-4 shadow-sm bg-white" },
                h("h3", { className:"font-semibold mb-2" }, "h2-forslag"),
                h("ul", { className:"list-disc pl-5 text-sm space-y-1" }, brief.h2s.map((x,i)=> h("li", { key:i }, x)))
              ),
              h("div", { key:"q", className:"rounded-2xl border p-4 shadow-sm bg-white" },
                h("h3", { className:"font-semibold mb-2" }, "ofte stillede spørgsmål"),
                h("ul", { className:"list-disc pl-5 text-sm space-y-1" }, brief.questions.map((x,i)=> h("li", { key:i }, x)))
              ),
              h("div", { key:"n", className:"rounded-2xl border p-4 shadow-sm bg-white" },
                h("h3", { className:"font-semibold mb-2" }, "interne links"),
                h("ul", { className:"list-disc pl-5 text-sm space-y-1" }, brief.intern.map((x,i)=> h("li", { key:i }, x)))
              )
            ])
          : h("p", { className:"text-sm text-neutral-600" }, "Skriv et søgeord for at generere et skelet.")
      )
    ])
  );
}

/* ---------- Kontaktformular ---------- */
function ContactForm() {
  return h(Section, { title:"Kontakt os" },
    h("form", { action:"https://formspree.io/f/mjkolqrk", method:"POST", className:"space-y-4" }, [
      h("label", { key:"name", className:"block mb-3" }, [
        h("span", { className:"block text-sm font-medium mb-1" }, "Navn"),
        h("input", { name:"name", required:true, className:"w-full border rounded-xl p-3 focus:outline-none focus:ring focus:ring-indigo-200", placeholder:"Dit navn" })
      ]),
      h("label", { key:"email", className:"block mb-3" }, [
        h("span", { className:"block text-sm font-medium mb-1" }, "E-mail"),
        h("input", { type:"email", name:"_replyto", required:true, className:"w-full border rounded-xl p-3 focus:outline-none focus:ring focus:ring-indigo-200", placeholder:"din@email.dk" })
      ]),
      h("label", { key:"msg", className:"block mb-3" }, [
        h("span", { className:"block text-sm font-medium mb-1" }, "Besked"),
        h("textarea", { name:"message", rows:5, required:true, className:"w-full border rounded-xl p-3 focus:outline-none focus:ring focus:ring-indigo-200", placeholder:"Skriv din besked her..." })
      ]),
      h("button", { key:"btn", type:"submit", className:"px-4 py-2 rounded-2xl text-white bg-blue-600 hover:bg-blue-700" }, "Send")
    ])
  );
}

/* ---------- App ---------- */
function App() {
  return h("main", { className:"max-w-6xl mx-auto p-4 space-y-8" }, [
    h(Hero, { key:"hero" }),
    h(PartnersSection, { key:"partners" }),      // lige under hero
    h(KeywordIdeas, { key:"kw" }),
    h(SerpAndMeta, { key:"serp" }),
    h(RobotsTxt, { key:"rob" }),
    h(SitemapXml, { key:"map" }),
    h(FaqSchema, { key:"faq" }),
    h(ContentBrief, { key:"brief" }),
    h(ContactForm, { key:"contact" })
  ]);
}

/* ---------- Mount ---------- */
ReactDOM.createRoot(document.getElementById("root")).render(h(App));
