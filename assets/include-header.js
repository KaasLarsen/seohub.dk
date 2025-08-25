// /assets/include-header.js  (v7 stable desktop dropdown + fuld mobil burger med “Værktøjer” accordion)
(function () {
  // --- Konfiguration: links ---
  const PRIMARY = [
    { href: "/", label: "Forside", key: "/" },
    { href: "/blog/", label: "Blog", key: "/blog" }
  ];

  const TOOLS = [
    { href: "/serp-preview.html",         label: "SERP & Meta",          key: "/serp-preview.html" },
    { href: "/robots-generator.html",     label: "Robots.txt",            key: "/robots-generator.html" },
    { href: "/sitemap-generator.html",    label: "Sitemap.xml",           key: "/sitemap-generator.html" },
    { href: "/internal-link-builder.html",label: "Intern linkbuilder",    key: "/internal-link-builder.html" },
    { href: "/meta-tag-generator.html",   label: "Meta Tag Generator",    key: "/meta-tag-generator.html" },
    { href: "/redirect-checker.html",     label: "Redirect Checker",      key: "/redirect-checker.html" },
    { href: "/page-speed-check.html",     label: "Page Speed Check",      key: "/page-speed-check.html" },
    { href: "/twitter-card-preview.html", label: "Twitter Card Preview",  key: "/twitter-card-preview.html" }
  ];

  // --- Template ---
  const html = `
  <header class="border-b bg-white/80 backdrop-blur sticky top-0 z-40">
    <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
      <a href="/" class="font-semibold text-neutral-900">Seohub.dk</a>

      <!-- Desktop nav -->
      <nav class="hidden md:flex items-center gap-4 text-sm text-neutral-700">
        ${PRIMARY.map(a => `<a href="${a.href}" data-page="${a.key}">${a.label}</a>`).join("")}

        <!-- Værktøjer dropdown (desktop) -->
        <div class="relative group" id="toolsWrap">
          <button id="toolsBtn" type="button"
            class="inline-flex items-center gap-2 rounded-lg border px-3 py-2 hover:bg-neutral-50">
            Værktøjer
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>

          <div id="toolsMenu"
               class="invisible opacity-0 pointer-events-none absolute right-0 mt-2 w-[280px] rounded-xl border bg-white shadow-lg transition
                      group-hover:visible group-hover:opacity-100 group-hover:pointer-events-auto z-50">
            <ul class="py-2 max-h-[70vh] overflow-auto">
              ${TOOLS.map(t => `
                <li>
                  <a href="${t.href}" data-page="${t.key}"
                     class="block px-3 py-2 hover:bg-neutral-50">${t.label}</a>
                </li>`).join("")}
            </ul>
          </div>
        </div>
      </nav>

      <!-- Burger (mobil) -->
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
    </div>

    <!-- Mobil nav -->
    <div id="siteNav"
      class="hidden md:hidden border-t bg-white/95 backdrop-blur">
      <nav class="max-w-6xl mx-auto px-4 py-3 text-sm">
        <div class="flex flex-col gap-2">
          ${PRIMARY.map(a => `
            <a href="${a.href}" data-page="${a.key}" class="px-2 py-2 rounded-lg hover:bg-neutral-50">${a.label}</a>
          `).join("")}

          <!-- Mobil accordion for Værktøjer -->
          <div class="border rounded-lg">
            <button id="mobToolsBtn" type="button"
              class="w-full flex items-center justify-between px-3 py-2">
              <span>Værktøjer</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline id="mobChevron" points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            <div id="mobToolsPane" class="hidden border-t">
              <ul class="py-2">
                ${TOOLS.map(t => `
                  <li>
                    <a href="${t.href}" data-page="${t.key}"
                       class="block px-3 py-2 hover:bg-neutral-50">${t.label}</a>
                  </li>
                `).join("")}
              </ul>
            </div>
          </div>
        </div>
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

  function mount() {
    // Fjern eksisterende header for at undgå dubletter
    const existing = document.querySelector("header");
    if (existing) existing.remove();

    // Indsæt ny header
    const wrap = document.createElement("div");
    wrap.innerHTML = html;
    document.body.insertBefore(wrap.firstElementChild, document.body.firstChild);

    const current = window.location.pathname;

    // Aktiv highlight
    document.querySelectorAll('a[data-page]').forEach(link => {
      const lp = link.getAttribute('data-page') || "";
      if (isActive(lp, current)) {
        link.classList.add("font-semibold","text-blue-600");
      }
    });

    // Desktop dropdown – stabil
    const toolsWrap = document.getElementById("toolsWrap");
    const toolsBtn  = document.getElementById("toolsBtn");
    const toolsMenu = document.getElementById("toolsMenu");

    let desktopOpen = false;
    function openDesktop() {
      desktopOpen = true;
      toolsMenu.classList.remove("invisible","opacity-0","pointer-events-none");
    }
    function closeDesktop() {
      desktopOpen = false;
      toolsMenu.classList.add("invisible","opacity-0","pointer-events-none");
    }

    if (toolsWrap && toolsBtn && toolsMenu) {
      // Åbn ved hover
      toolsWrap.addEventListener("mouseenter", openDesktop);
      toolsWrap.addEventListener("mouseleave", closeDesktop);

      // Åbn/luk ved klik (hjælper touchpad-brugere)
      toolsBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        desktopOpen ? closeDesktop() : openDesktop();
      });

      // Luk ikke dropdown lige når man klikker et link (lader navigation ske)
      toolsMenu.addEventListener("mousedown", (e) => {
        e.stopPropagation();
      });

      // Luk hvis man klikker andre steder
      document.addEventListener("click", (e) => {
        if (!toolsWrap.contains(e.target)) closeDesktop();
      });
    }

    // Mobil burger
    const navToggle = document.getElementById("navToggle");
    const siteNav   = document.getElementById("siteNav");
    function mobOpen()  { siteNav.classList.remove("hidden"); navToggle.setAttribute("aria-expanded","true"); }
    function mobClose() { siteNav.classList.add("hidden");   navToggle.setAttribute("aria-expanded","false"); }

    if (navToggle && siteNav) {
      navToggle.addEventListener("click", () => {
        const open = navToggle.getAttribute("aria-expanded") === "true";
        open ? mobClose() : mobOpen();
      });
      // Luk når man klikker link (mob)
      siteNav.querySelectorAll("a").forEach(a => {
        a.addEventListener("click", () => mobClose());
      });
    }

    // Mobil accordion for Værktøjer
    const mobBtn  = document.getElementById("mobToolsBtn");
    const mobPane = document.getElementById("mobToolsPane");
    const mobChevron = document.getElementById("mobChevron");

    if (mobBtn && mobPane) {
      mobBtn.addEventListener("click", () => {
        const isHidden = mobPane.classList.contains("hidden");
        if (isHidden) {
          mobPane.classList.remove("hidden");
          // vend chevron (simpelt: swap points)
          mobChevron.setAttribute("points", "6 15 12 9 18 15");
        } else {
          mobPane.classList.add("hidden");
          mobChevron.setAttribute("points", "6 9 12 15 18 9");
        }
      });
    }

    // Luk mobilmenu ved Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") mobClose();
    });

    // Luk mobil-menu når man resizer op
    window.addEventListener("resize", () => {
      if (window.matchMedia("(min-width: 768px)").matches) mobClose();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
