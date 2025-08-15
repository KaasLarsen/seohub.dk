// app.js — FAILSAFE: stor blå hero + 3 kort. Ingen afhængighed af andet.
const { createElement: h } = React;

function Hero() {
  return h("section", { className: "py-10 md:py-14" },
    h("div", { className: "max-w-6xl mx-auto px-4" },
      h("div", {
        className: "rounded-2xl p-12 md:p-20 text-white shadow-lg",
        style: { background: "linear-gradient(135deg,#6366f1 0%,#3b82f6 50%,#06b6d4 100%)" }
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

function App() {
  return h("main", { className: "max-w-6xl mx-auto p-4 space-y-8" }, [
    h(Hero, { key: "hero" })
  ]);
}

ReactDOM.createRoot(document.getElementById("root")).render(h(App));
