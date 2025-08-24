// /assets/include-header.js  (v7 – ENS værktøjsliste på desktop + mobil)
(function () {
  // Vedligehold links ét sted:
  const TOOLS = [
    { href: "/serp-preview.html",          label: "SERP & Meta",        key: "/serp-preview.html" },
    { href: "/robots-generator.html",      label: "Robots.txt",         key: "/robots-generator.html" },
    { href: "/sitemap-generator.html",     label: "Sitemap.xml",        key: "/sitemap-generator.html" },
    { href: "/internal-link-builder.html", label: "Intern linkbuilder", key: "/internal-link-builder.html" },
    { href: "/meta-tag-generator.html",    label: "Meta tags",          key: "/meta-tag-generator.html" },
    { href: "/page-speed-check.html",      label: "Page Speed",         key: "/page-speed-check.html" },
    { href: "/redirect-checker.html",      label: "Redirect Checker",   key: "/redirect-checker.html" }
  ];
  const TOP = [
    { href: "/",      label: "Forside", key: "/" },
    { href: "/blog/", label: "Blog",    key: "/blog" }
  ];

  const html = `
  <header class="border-b bg-white/80 backdrop-blur sticky top-0 z-40">
    <div class="max-w-6xl mx-auto p-4 flex items-center justify-between">
      <a href="/" class="font-semibold text-neutral-900">Seohub.dk</a>

      <!-- Mobile toggle -->
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

      <!-- Nav container -->
      <nav id="siteNav"
        class="hidden md:flex text-sm text-neutral-600 gap-4
               absolute left-0 right-0 top-full bg-white/95 backdrop-blur border-b
               md:static md:border-0 md:bg-transparent md:backdrop-blur-0 md:items-center md:justify-end p-4 md:p-0">
        <div id="navInner" class="w-full md:w-auto md:flex md:items-center md:gap-4"></div>
      </nav>
    </div>
  </header>
  `;

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

  function renderNav(inner) {
    const topLinks = TOP.map(it =>
      `<a class="block md:inline-block py-2 md:py-0" href="${it.href}" data-page="${it.key}">${it.label}</a>`
    ).join("");

    // Desktop dropdown – bruger samme TOOLS-array
    const toolsDesktop = `
      <div class="relative hidden md:block" id="toolsDesktop">
        <button id="toolsBtn" type="button"
          class="inline-flex items-center gap-1 rounded-lg border px-3 py-2 hover:bg-neutral-50">
          Værktøjer
          <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M5.23 7.21a.75.75 0 011.06.02L10 11.127l3.71-3.896a.75.75 0 111.08 1.04l-4.24 4.457a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"/></svg>
        </button>
        <div id="toolsMenu"
             class="absolute right-0 mt-2 w-64 rounded-xl border bg-white shadow-lg p-2 hidden z-50">
          ${TOOLS.map(t => `<a class="block rounded-lg px-3 py-2 hover:bg-neutral-50" href="${t.href}" data-page="${t.key}">${t.label}</a>`).join("")}
        </div>
      </div>
    `;

    // Mobil accordion – samme TOOLS-array
    const toolsMobile = `
      <div class="md:hidden border-t pt-2 mt-2" id="toolsMobile">
        <button id="toolsMobBtn" type="button"
          class="w-full flex items-center justify-between rounded-lg border px-3 py-2 hover:bg-neutral-50">
          <span>Værktøjer</span>
          <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M5.23 7.21a.75.75 0 011.06.02L10 11.127l3.71-3.896a.75.75 0 111.08 1.04l-4.24 4.457a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"/></svg>
        </button>
        <div id="toolsMobWrap" class="hidden mt-2">
          ${TOOLS.map(t => `<a class="block rounded-lg px-3 py-2 hover:bg-neutral-50" href="${t.href}" data-page="${t.key}">${t.label}</a>`).join("")}
        </div>
      </div>
    `;

    inner.innerHTML = `
      <div class="md:flex md:items-center md:gap-4">
        ${topLinks}
        ${toolsDesktop}
      </div>
      ${toolsMobile}
    `;
  }

  function mount() {
    // Fjern gammel header for at undgå dubletter
    const existing = document.querySelector("header");
    if (existing) existing.remove();

    // Indsæt ny
    const wrap = document.createElement("div");
    wrap.innerHTML = html;
    document.body.insertBefore(wrap.firstElementChild, document.body.firstChild);

    const nav   = document.getElementById("siteNav");
    const inner = document.getElementById("navInner");
    renderNav(inner);

    // Mobile toggle
    const btn = document.getElementById("navToggle");
    function closeNav() { nav.classList.add("hidden"); btn?.setAttribute("aria-expanded","false"); }
    function openNav()  { nav.classList.remove("hidden"); btn?.setAttribute("aria-expanded","true"); }
    if (btn && nav) {
      btn.addEventListener("click", () => {
        const open = btn.getAttribute("aria-expanded") === "true";
        open ? closeNav() : openNav();
      });
      window.addEventListener("resize", () => {
        if (window.matchMedia('(min-width: 768px)').matches) closeNav();
      });
      document.addEventListener("keydown", e => { if (e.key === "Escape") closeNav(); });
    }

    // Desktop dropdown
    const toolsBtn  = document.getElementById("toolsBtn");
    const toolsMenu = document.getElementById("toolsMenu");
    if (toolsBtn && toolsMenu) {
      let open = false;
      const openMenu  = () => { toolsMenu.classList.remove("hidden"); open = true; };
      const closeMenu = () => { toolsMenu.classList.add("hidden"); open = false; };
      toolsBtn.addEventListener("click", e => { e.stopPropagation(); open ? closeMenu() : openMenu(); });
      document.addEventListener("click", e => { if (open && !toolsMenu.contains(e.target) && e.target !== toolsBtn) closeMenu(); });
      window.addEventListener("scroll", closeMenu, { passive: true });
    }

    // Mobil accordion
    const toolsMobBtn  = document.getElementById("toolsMobBtn");
    const toolsMobWrap = document.getElementById("toolsMobWrap");
    if (toolsMobBtn && toolsMobWrap) {
      toolsMobBtn.addEventListener("click", () => toolsMobWrap.classList.toggle("hidden"));
    }

    // Aktivt link highlight
    const current = window.location.pathname;
    document.querySelectorAll('nav a[data-page]').forEach(a => {
      const lp = a.getAttribute('data-page') || "";
      if (isActive(lp, current)) a.classList.add("font-semibold", "text-blue-600");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
