/* ---------- React Components ---------- */
function Section({ title, children }) {
  return React.createElement("section", { className: "max-w-6xl mx-auto my-12 p-6 bg-white shadow rounded-2xl" }, [
    React.createElement("h2", { key: "h", className: "text-2xl font-bold mb-6" }, title),
    children
  ]);
}

/* ---------- Hero med ikoner ---------- */
function Hero() {
  return React.createElement("div", { className: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-20" },
    React.createElement("div", { className: "max-w-6xl mx-auto px-4 text-center" }, [
      React.createElement("h1", { key: "h1", className: "text-4xl md:text-5xl font-bold mb-6" }, "SEO værktøjer der sparer dig tid"),
      React.createElement("p", { key: "p", className: "text-lg md:text-xl mb-10" }, "Gratis online værktøjer til analyse, optimering og SEO-strategi."),
      React.createElement("div", { key: "icons", className: "grid grid-cols-1 md:grid-cols-3 gap-8 mt-10" }, [
        React.createElement("div", { key: "1", className: "p-6 bg-white/10 rounded-xl backdrop-blur" }, [
          React.createElement("div", { className: "text-4xl mb-4" }, "🔍"),
          React.createElement("h3", { className: "font-semibold mb-2" }, "SERP Preview"),
          React.createElement("p", { className: "text-sm opacity-80" }, "Se hvordan dine titler og beskrivelser vises på Google.")
        ]),
        React.createElement("div", { key: "2", className: "p-6 bg-white/10 rounded-xl backdrop-blur" }, [
          React.createElement("div", { className: "text-4xl mb-4" }, "🤖"),
          React.createElement("h3", { className: "font-semibold mb-2" }, "Robots.txt generator"),
          React.createElement("p", { className: "text-sm opacity-80" }, "Lav en korrekt robots.txt på få sekunder.")
        ]),
        React.createElement("div", { key: "3", className: "p-6 bg-white/10 rounded-xl backdrop-blur" }, [
          React.createElement("div", { className: "text-4xl mb-4" }, "🗺️"),
          React.createElement("h3", { className: "font-semibold mb-2" }, "Sitemap generator"),
          React.createElement("p", { className: "text-sm opacity-80" }, "Opret et sitemap.xml der hjælper Google med at indeksere din side.")
        ])
      ])
    ])
  );
}

/* ---------- Værktøjs-komponenter ---------- */
function KeywordIdeas() { return React.createElement(Section, { title: "Keyword Ideas" }, "Her kommer Keyword Ideas tool..."); }
function SerpAndMeta() { return React.createElement(Section, { title: "SERP Preview" }, "Her kommer SERP preview tool..."); }
function RobotsTxt() { return React.createElement(Section, { title: "Robots.txt Generator" }, "Her kommer Robots.txt generator..."); }
function SitemapXml() { return React.createElement(Section, { title: "Sitemap Generator" }, "Her kommer Sitemap generator..."); }
function FaqSchema() { return React.createElement(Section, { title: "FAQ Schema Generator" }, "Her kommer FAQ schema tool..."); }
function ContentBrief() { return React.createElement(Section, { title: "Content Brief" }, "Her kommer Content Brief tool..."); }

/* ---------- Kontaktformular ---------- */
function ContactForm() {
  return React.createElement(Section, { title: "Kontakt os" },
    React.createElement("form", { action: "https://formspree.io/f/mjkolqrk", method: "POST", className: "space-y-4" }, [
      React.createElement("label", { key: "name", className: "block mb-3" }, [
        React.createElement("span", { className: "block text-sm font-medium mb-1" }, "Navn"),
        React.createElement("input", { name: "name", required: true, className: "w-full border rounded-xl p-3 focus:outline-none focus:ring focus:ring-indigo-200", placeholder: "Dit navn" })
      ]),
      React.createElement("label", { key: "email", className: "block mb-3" }, [
        React.createElement("span", { className: "block text-sm font-medium mb-1" }, "E-mail"),
        React.createElement("input", { type: "email", name: "_replyto", required: true, className: "w-full border rounded-xl p-3 focus:outline-none focus:ring focus:ring-indigo-200", placeholder: "din@email.dk" })
      ]),
      React.createElement("label", { key: "msg", className: "block mb-3" }, [
        React.createElement("span", { className: "block text-sm font-medium mb-1" }, "Besked"),
        React.createElement("textarea", { name: "message", rows: 5, required: true, className: "w-full border rounded-xl p-3 focus:outline-none focus:ring focus:ring-indigo-200", placeholder: "Skriv din besked her..." })
      ]),
      React.createElement("button", { key: "btn", type: "submit", className: "px-4 py-2 rounded-2xl text-white bg-blue-600 hover:bg-blue-700" }, "Send")
    ])
  );
}

/* ---------- Seneste fra bloggen ---------- */
function RecentPosts() {
  const [items, setItems] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/blog/posts.json?ts=' + Date.now(), { cache: 'no-store' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error('Ugyldig JSON');
        const top = data.slice().sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 3);
        setItems(top);
      } catch (e) {
        console.error('RecentPosts fejl:', e);
        setError('Kunne ikke indlæse indlæg lige nu.');
        setItems([]);
      }
    })();
  }, []);

  return React.createElement(Section, { title: "Seneste fra bloggen" },
    items === null
      ? React.createElement("div", { className: "grid md:grid-cols-3 gap-4" },
          [0, 1, 2].map(i => React.createElement("div", { key: i, className: "rounded-2xl border p-5 bg-white animate-pulse h-40" }))
        )
      : error
        ? React.createElement("p", { className: "text-sm text-neutral-600" }, error)
        : items.length === 0
          ? React.createElement("p", { className: "text-sm text-neutral-600" }, "Ingen indlæg endnu.")
          : React.createElement("div", { className: "grid md:grid-cols-3 gap-4" },
              items.map((p, i) => {
                const href = `/blog/${p.slug}.html`;
                const date = p.date ? new Date(p.date).toLocaleDateString('da-DK') : '';
                const tagChips = (Array.isArray(p.tags) ? p.tags : []).map((t, j) =>
                  React.createElement("a", { key: j, href: `/blog/?tag=${encodeURIComponent(t)}`, className: "text-xs bg-neutral-100 border px-2 py-1 rounded-full hover:bg-neutral-200", onClick: e => e.stopPropagation() }, t)
                );
                return React.createElement("a", { key: i, href, className: "rounded-2xl border p-5 bg-white hover:shadow transition block" }, [
                  React.createElement("h3", { key: "h", className: "font-semibold" }, p.title || "Uden titel"),
                  React.createElement("p", { key: "d", className: "text-xs text-neutral-500 mt-1" }, date),
                  p.excerpt ? React.createElement("p", { key: "e", className: "text-sm text-neutral-700 mt-3 line-clamp-3" }, p.excerpt) : null,
                  tagChips.length ? React.createElement("div", { key: "t", className: "flex gap-2 mt-3 flex-wrap" }, tagChips) : null,
                  React.createElement("span", { key: "l", className: "inline-block mt-4 text-blue-600" }, "Læs mere →")
                ]);
              })
            )
  );
}

/* ---------- Footer ---------- */
function Footer() {
  return React.createElement("footer", { className: "text-center text-xs text-neutral-500 py-8" }, "© 2025 Seohub – seohub.dk");
}

/* ---------- App ---------- */
function App() {
  return React.createElement("div", null, [
    React.createElement(Hero, { key: "hero" }),
    React.createElement(KeywordIdeas, { key: "kw" }),
    React.createElement(SerpAndMeta, { key: "serp" }),
    React.createElement(RobotsTxt, { key: "rob" }),
    React.createElement(SitemapXml, { key: "map" }),
    React.createElement(FaqSchema, { key: "faq" }),
    React.createElement(ContentBrief, { key: "brief" }),
    React.createElement(ContactForm, { key: "contact" }),
    React.createElement(RecentPosts, { key: "recent" }),
    React.createElement(Footer, { key: "footer" })
  ]);
}

/* ---------- Mount ---------- */
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));
