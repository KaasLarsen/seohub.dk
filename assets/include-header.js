/* /assets/include-header.js — v7 (mobil = samme links som desktop)
   - ÉN sand kilde: NAV_ITEMS
   - Burger-menu på mobil
   - Aktivt link highlight
*/

(function () {
  // 1) Redigér KUN her for at tilføje/fjerne punkter
  const NAV_ITEMS = [
    { href: "/",                          label: "Forside",        key: "/" },
    { href: "/serp-preview.html",         label: "SERP",           key: "/serp-preview.html" },
    { href: "/robots-generator.html",     label: "Robots",         key: "/robots-generator.html" },
    { href: "/sitemap-generator.html",    label: "Sitemap",        key: "/sitemap-generator.html" },
    { href: "/internal-link-builder.html",label: "Intern links",   key: "/internal-link-builder.html" },
    { href: "/meta-tag-generator.html",   label: "Meta Tags",      key: "/meta-tag-generator.html" },
    { href: "/redirect-checker.html",     label: "Redirect Checker", key: "/redirect-checker.html" },
    { href: "/page-speed-check.html",     label: "Page Speed",     key: "/page-speed-check.html" },
    { href: "/blog/",                     label: "Blog",           key: "/blog" }
  ];

  // 2) Header markup (desktop + mobil deler samme liste)
  const html = `
  <header class="border-b bg-white/80 backdrop-blur sticky top-0 z-40">
    <div class="max-w-6xl mx-auto p-4 flex items-center justify-between">
      <a href="/" class="font-semibold text-neutral-900">Seohub.dk</a>

      <!-- Mobil toggle -->
      <button id="navToggle" aria-controls="siteNav" aria-expanded="false"
        class="md:hidden inline-flex items-center justify-center rounded-lg border px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
        type="button">
        <span class="sr-only">Åbn menu</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>

      <!-- Nav (samme links for mobil/desktop) -->
      <nav id="siteNav"
        class="hidden md:flex text-sm text-neutral-600 gap-4
               absolute left-0 right-0 top-full bg-white/95 backdrop-blur border-b
               md:static md:border-0 md:bg-transparent md:backdrop-blur-0 md:items-center md:justify-end p-4 md:p-0">
        ${NAV_ITEMS.map(i => `<a href="${i.href}" data-page="${i.key}">${i.label}</a>`).join("")}
      </nav>
    </div>
  </header>
  `;

  // 3) Hjælpere
  function normalizePath(p) {
    if (!p) return "/";
    let out = p.replace(/index\.html$/i, "");
    if (out.length > 1 && out.endsWith("/")) out = out.slice(0, -1);
    return out || "/";
  }
  function isActive(linkPath, currentPath) {
    const lp = normalizePath(linkPath);
    const cp = normalizePath(currentPath);
    if (lp === "/") return cp === "/";
    return cp === lp || cp.startsWith(lp + "/");
  }

  // 4) Mount + interaktion
  function mount() {
    const existing = document.querySelector("header");
    if (existing) existing.remove();

    const wrap = document.createElement("div");
    wrap.innerHTML = html;
    document.body.insertBefore(wrap.firstElementChild, document.body.firstChild);

    const btn = document.getElementById("navToggle");
    const nav = document.getElementById("siteNav");

    function closeNav() { nav.classList.add("hidden"); btn && btn.setAttribute("aria-expanded","false"); }
    function openNav()  { nav.classList.remove("hidden"); btn && btn.setAttribute("aria-expanded","true"); }

    if (btn && nav) {
      btn.addEventListener("click", () => {
        const open = btn.getAttribute("aria-expanded") === "true";
        open ? closeNav() : openNav();
      });

      // Luk ved klik på link på mobil
      nav.querySelectorAll("a").forEach(a => {
        a.addEventListener("click", () => {
          if (window.matchMedia("(max-width: 767px)").matches) closeNav();
        });
      });

      // Escape + resize
      document.addEventListener("keydown", e => { if (e.key === "Escape") closeNav(); });
      window.addEventListener("resize", () => {
        if (window.matchMedia("(min-width: 768px)").matches) closeNav();
      });
    }

    // Aktivt link
    const current = window.location.pathname;
    nav.querySelectorAll("a[data-page]").forEach(link => {
      const lp = link.getAttribute("data-page") || "";
      if (isActive(lp, current)) link.classList.add("font-semibold", "text-blue-600");
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
