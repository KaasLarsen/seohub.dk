// /assets/include-header.js (v7) — Dropdown "Værktøjer", mobil burger, aktivt link
(function () {
  const TOOLS = [
    { href: "/serp-preview.html", label: "SERP & Meta", key: "/serp-preview.html" },
    { href: "/robots-generator.html", label: "Robots.txt", key: "/robots-generator.html" },
    { href: "/sitemap-generator.html", label: "Sitemap.xml", key: "/sitemap-generator.html" },
    { href: "/internal-link-builder.html", label: "Intern links", key: "/internal-link-builder.html" },
    { href: "/redirect-checker.html", label: "Redirect Checker", key: "/redirect-checker.html" },
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
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
             class="pointer-events-none">
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>

      <!-- Nav wrapper -->
      <nav id="siteNav"
        class="hidden md:flex text-sm text-neutral-600 gap-4
               absolute left-0 right-0 top-full bg-white/95 backdrop-blur border-b
               md:static md:border-0 md:bg-transparent md:backdrop-blur-0 md:items-center md:justify-end p-4 md:p-0">

        <a href="/" data-page="/">Forside</a>

        <!-- Desktop: Tools dropdown -->
        <div class="relative hidden md:block" id="toolsDesktop">
          <button type="button"
            class="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-neutral-50"
            aria-haspopup="true" aria-expanded="false" id="toolsBtn">
            Værktøjer
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <div id="toolsMenu"
               class="hidden absolute right-0 mt-2 w-64 rounded-xl border bg-white shadow-lg overflow-hidden">
            <div class="py-2" id="toolsMenuItems"></div>
          </div>
        </div>

        <!-- Mobil: Tools accordion -->
        <div class="md:hidden w-full" id="toolsMobile">
          <button type="button"
            class="w-full flex items-center justify-between rounded-lg border p-3 bg-white">
            <span>Værktøjer</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <div class="hidden mt-2 rounded-lg border bg-white" id="toolsMobileList"></div>
        </div>

        <a href="/blog/" data-page="/blog/">Blog</a>
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

  function buildToolsList(container, itemClass) {
    container.innerHTML = "";
    TOOLS.forEach(t => {
      const a = document.createElement("a");
      a.href = t.href;
      a.textContent = t.label;
      a.className = itemClass;
      a.setAttribute("data-tool", t.key);
      container.appendChild(a);
    });
  }

  function markActive(navEl) {
    const current = window.location.pathname;
    // Top-level links
    navEl.querySelectorAll('a[data-page]').forEach(link => {
      const lp = link.getAttribute('data-page') || "";
      if (isActive(lp, current)) {
        link.classList.add("font-semibold","text-blue-600");
      }
    });
    // Tools items (both desktop + mobile)
    const matchTool = TOOLS.find(t => isActive(t.key, current));
    if (matchTool) {
      navEl.querySelectorAll('[data-tool]').forEach(a => {
        if (isActive(a.getAttribute('data-tool'), current)) {
          a.classList.add("bg-neutral-50","text-blue-700","font-medium");
        }
      });
      // also highlight the "Værktøjer"-button
      const btn = navEl.querySelector("#toolsBtn");
      if (btn) btn.classList.add("font-semibold","text-blue-600");
    }
  }

  function mount() {
    // Fjern eksisterende header (undgå dublering)
    const existing = document.querySelector('header');
    if (existing) existing.remove();

    const wrap = document.createElement('div');
    wrap.innerHTML = html;
    document.body.insertBefore(wrap.firstElementChild, document.body.firstChild);

    const btn = document.getElementById('navToggle');
    const nav = document.getElementById('siteNav');

    // Burger
    function closeNav() { nav.classList.add('hidden'); btn && btn.setAttribute('aria-expanded','false'); }
    function openNav() { nav.classList.remove('hidden'); btn && btn.setAttribute('aria-expanded','true'); }

    if (btn && nav) {
      btn.addEventListener('click', () => {
        const open = btn.getAttribute('aria-expanded') === 'true';
        open ? closeNav() : openNav();
      });
      document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });
      window.addEventListener('resize', () => {
        if (window.matchMedia('(min-width: 768px)').matches) closeNav();
      });
    }

    // Tools: build desktop dropdown & mobile list
    const toolsMenuItems = document.getElementById("toolsMenuItems");
    const toolsMenu = document.getElementById("toolsMenu");
    const toolsBtn = document.getElementById("toolsBtn");
    const toolsMobile = document.getElementById("toolsMobile");
    const toolsMobileList = document.getElementById("toolsMobileList");

    if (toolsMenuItems) {
      buildToolsList(toolsMenuItems, "block px-4 py-2 hover:bg-neutral-50");
    }
    if (toolsMobileList) {
      buildToolsList(toolsMobileList, "block px-4 py-2 hover:bg-neutral-50 border-t first:border-t-0");
    }

    // Desktop dropdown open/close
    if (toolsBtn && toolsMenu) {
      let dropdownOpen = false;
      function openDD() { toolsMenu.classList.remove("hidden"); toolsBtn.setAttribute("aria-expanded","true"); dropdownOpen = true; }
      function closeDD() { toolsMenu.classList.add("hidden"); toolsBtn.setAttribute("aria-expanded","false"); dropdownOpen = false; }

      toolsBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdownOpen ? closeDD() : openDD();
      });
      document.addEventListener("click", (e) => {
        if (!dropdownOpen) return;
        const inside = toolsMenu.contains(e.target) || toolsBtn.contains(e.target);
        if (!inside) closeDD();
      });
      // også åbne på hover (desktop)
      const toolsWrap = document.getElementById("toolsDesktop");
      if (toolsWrap) {
        toolsWrap.addEventListener("mouseenter", openDD);
        toolsWrap.addEventListener("mouseleave", closeDD);
      }
    }

    // Mobile accordion
    if (toolsMobile && toolsMobileList) {
      const btn = toolsMobile.querySelector("button");
      btn.addEventListener("click", () => {
        toolsMobileList.classList.toggle("hidden");
      });
    }

    // Luk mobilnav ved klik på link (god UX)
    if (nav) {
      nav.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          if (window.matchMedia('(max-width: 767px)').matches) closeNav();
        });
      });
    }

    // Aktiv markering
    if (nav) markActive(nav);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
