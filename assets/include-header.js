/* /assets/include-header.js — v7 (med samlet “Værktøjer”-menu)
   - Forside & Blog står alene
   - Alle tools samlet under dropdown/accordion
   - Én sand kilde for links
*/

(function () {
  // === LINKS ===
  const TOP_LEVEL = [
    { href: "/",      label: "Forside", key: "/" },
    { href: "/blog/", label: "Blog",    key: "/blog" }
  ];

  const NAV_TOOLS = [
    { href: "/serp-preview.html",         label: "SERP & Meta",        key: "/serp-preview.html" },
    { href: "/robots-generator.html",     label: "Robots.txt",         key: "/robots-generator.html" },
    { href: "/sitemap-generator.html",    label: "Sitemap.xml",        key: "/sitemap-generator.html" },
    { href: "/internal-link-builder.html",label: "Intern linkbuilder", key: "/internal-link-builder.html" },
    { href: "/meta-tag-generator.html",   label: "Meta Tag Generator", key: "/meta-tag-generator.html" },
    { href: "/redirect-checker.html",     label: "Redirect Checker",   key: "/redirect-checker.html" },
    { href: "/page-speed-check.html",     label: "Page Speed Check",   key: "/page-speed-check.html" }
  ];

  // Hjælpere
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
  function anyToolActive(currentPath) {
    return NAV_TOOLS.some(t => isActive(t.key, currentPath));
  }

  const desktopTools = `
    <div class="relative group">
      <button type="button"
        class="inline-flex items-center gap-1 px-2 py-1 rounded-md hover:bg-neutral-100"
        aria-haspopup="true" aria-expanded="false">
        Værktøjer
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      <div class="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition
                  absolute right-0 mt-2 w-64 rounded-xl border bg-white shadow-lg p-2 z-50">
        ${NAV_TOOLS.map(t => `
          <a href="${t.href}" data-page="${t.key}"
             class="block px-3 py-2 rounded-lg text-sm text-neutral-700 hover:bg-neutral-50">
            ${t.label}
          </a>
        `).join("")}
      </div>
    </div>
  `;

  const mobileTools = `
    <div class="border-t pt-3 mt-3">
      <button id="toolsToggle" type="button"
        class="w-full inline-flex items-center justify-between rounded-lg border px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
        <span>Værktøjer</span>
        <svg id="toolsChevron" width="20" height="20" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
             class="transition-transform">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      <div id="toolsPanel" class="hidden mt-2 pl-1">
        ${NAV_TOOLS.map(t => `
          <a href="${t.href}" data-page="${t.key}"
             class="block px-3 py-2 rounded-lg text-sm text-neutral-700 hover:bg-neutral-50">
            ${t.label}
          </a>
        `).join("")}
      </div>
    </div>
  `;

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

      <!-- Nav -->
      <nav id="siteNav"
        class="hidden md:flex text-sm text-neutral-700 gap-4
               absolute left-0 right-0 top-full bg-white/95 backdrop-blur border-b
               md:static md:border-0 md:bg-transparent md:backdrop-blur-0 md:items-center md:justify-end p-4 md:p-0">

        <!-- Desktop venstre/højre -->
        <div class="hidden md:flex items-center gap-4">
          ${TOP_LEVEL.map(i => `<a href="${i.href}" data-page="${i.key}">${i.label}</a>`).join("")}
          ${desktopTools}
        </div>

        <!-- Mobil indhold -->
        <div class="md:hidden w-full space-y-2">
          ${TOP_LEVEL.map(i => `
            <a href="${i.href}" data-page="${i.key}"
               class="block px-3 py-2 rounded-lg hover:bg-neutral-50">${i.label}</a>`).join("")}
          ${mobileTools}
        </div>
      </nav>
    </div>
  </header>
  `;

  function mount() {
    const existing = document.querySelector("header");
    if (existing) existing.remove();

    const wrap = document.createElement("div");
    wrap.innerHTML = html;
    document.body.insertBefore(wrap.firstElementChild, document.body.firstChild);

    const btn = document.getElementById("navToggle");
    const nav = document.getElementById("siteNav");
    function closeNav(){ nav.classList.add("hidden"); btn && btn.setAttribute("aria-expanded","false"); }
    function openNav(){  nav.classList.remove("hidden"); btn && btn.setAttribute("aria-expanded","true"); }

    if (btn && nav) {
      btn.addEventListener("click", () => {
        const open = btn.getAttribute("aria-expanded") === "true";
        open ? closeNav() : openNav();
      });
      document.addEventListener("keydown", e => { if (e.key === "Escape") closeNav(); });
      window.addEventListener("resize", () => {
        if (window.matchMedia("(min-width: 768px)").matches) closeNav();
      });
      // Luk ved klik på et link (mobil)
      nav.querySelectorAll("a").forEach(a=>{
        a.addEventListener("click", ()=>{
          if (window.matchMedia('(max-width: 767px)').matches) closeNav();
        });
      });
    }

    // Mobil accordion for tools
    const tBtn = document.getElementById("toolsToggle");
    const tPanel = document.getElementById("toolsPanel");
    const tChevron = document.getElementById("toolsChevron");
    if (tBtn && tPanel) {
      tBtn.addEventListener("click", () => {
        const hidden = tPanel.classList.contains("hidden");
        if (hidden) {
          tPanel.classList.remove("hidden");
          if (tChevron) tChevron.style.transform = "rotate(180deg)";
        } else {
          tPanel.classList.add("hidden");
          if (tChevron) tChevron.style.transform = "";
        }
      });
    }

    // Aktivt link highlight
    const current = window.location.pathname;
    // Top-level
    document.querySelectorAll('a[data-page]').forEach(link => {
      const lp = link.getAttribute('data-page') || "";
      if (isActive(lp, current)) {
        link.classList.add("font-semibold", "text-blue-600");
      }
    });
    // Markér “Værktøjer” hvis et tool er aktivt (desktop knappen)
    if (anyToolActive(current)) {
      const desktopButton = document.querySelector('header .group > button');
      if (desktopButton) desktopButton.classList.add("font-semibold", "text-blue-600");
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
