// /app.js — Hero + Værktøjsgrid (stabil)
const { createElement: h } = React;

/* ---------- HERO ---------- */
function Hero() {
  return h("section", { className: "py-10 md:py-14" },
    h("div", { className: "max-w-6xl mx-auto px-4" },
      h("div", {
        className: "rounded-2xl p-12 md:p-20 text-white shadow-lg",
        style: { background: "linear-gradient(135deg,#6366f1 0%,#3b82f6 50%,#06b6d4 100%)" }
      }, [
        h("h1", { key:"h", className:"text-4xl md:text-6xl font-extrabold mb-4 leading-tight" }, "Gratis SEO værktøjer"),
        h("p", { key:"p", className:"text-blue-100 text-lg md:text-xl max-w-3xl" },
          "Vælg et værktøj – ingen login, ingen installation.")
      ])
    )
  );
}

/* ---------- IKON-KOMP ---------- */
function IconCircle({ children }) {
  return h("div", { className:"w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center mb-3" }, children);
}

/* ---------- VÆRKTØJSGRID ---------- */
function ToolsGrid() {
  const Card = ({ href, title, desc, icon }) =>
    h("a", { href, className:"block rounded-2xl border p-5 bg-white shadow-sm hover:shadow transition focus:outline-none focus:ring-2 focus:ring-blue-300" }, [
      h(IconCircle, { key:"i" }, icon),
      h("h3", { key:"t", className:"text-lg font-semibold leading-tight" }, title),
      h("p", { key:"d", className:"text-sm text-neutral-600 mt-1" }, desc)
    ]);

  return h("section", { className:"max-w-6xl mx-auto px-4 my-8" },
    h("div", { className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" }, [
      // SERP
      h(Card, {
        key:"serp",
        href:"/serp-preview.html",
        title:"SERP & Meta",
        desc:"Forhåndsvisning + længde-tjek",
        icon: h("svg", { className:"w-6 h-6", fill:"none", stroke:"currentColor", strokeWidth:"1.8", strokeLinecap:"round", strokeLinejoin:"round", viewBox:"0 0 24 24" },
          h("path", { d:"M21 21l-4.35-4.35M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" })
        )
      }),
      // Robots
      h(Card, {
        key:"robots",
        href:"/robots-generator.html",
        title:"Robots.txt",
        desc:"Byg og download",
        icon: h("svg", { className:"w-6 h-6", fill:"none", stroke:"currentColor", strokeWidth:"1.8", strokeLinecap:"round", strokeLinejoin:"round", viewBox:"0 0 24 24" },
          h("path", { d:"M12 2v4m0 12v4M2 12h4m12 0h4M7 7l10 10M17 7L7 17" })
        )
      }),
      // Sitemap
      h(Card, {
        key:"sitemap",
        href:"/sitemap-generator.html",
        title:"Sitemap.xml",
        desc:"Generér fra liste af URLs",
        icon: h("svg", { className:"w-6 h-6", fill:"none", stroke:"currentColor", strokeWidth:"1.8", strokeLinecap:"round", strokeLinejoin:"round", viewBox:"0 0 24 24" },
          h("path", { d:"M4 6h16M4 12h10M4 18h7" })
        )
      }),
      // Intern links
      h(Card, {
        key:"ilb",
        href:"/internal-link-builder.html",
        title:"Intern links",
        desc:"Foreslå interne links ud fra URL’er",
        icon: h("svg", { className:"w-6 h-6", fill:"none", stroke:"currentColor", strokeWidth:"1.8", strokeLinecap:"round", strokeLinejoin:"round", viewBox:"0 0 24 24" },
          h("path", { d:"M10 13a5 5 0 0 1 7-7l1 1m-4 4a5 5 0 0 1-7 7l-1-1" })
        )
      })
    ])
  );
}

/* ---------- APP ---------- */
function App() {
  return h("main", { className: "max-w-6xl mx-auto p-4 space-y-8" }, [
    h(Hero, { key:"hero" }),
    h(ToolsGrid, { key:"tools" })
  ]);
}

/* ---------- MOUNT ---------- */
ReactDOM.createRoot(document.getElementById("root")).render(h(App));
