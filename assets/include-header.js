// /assets/include-header.js  (v7 – beholder samme URL-param i dine sider)
// Mobil: burger + "Værktøjer" som accordion med ALLE værktøjer
// Desktop: hover/click dropdown, bliver åben mens man klikker

const LINKS_LEFT = [
  { href: "/",            label: "Forside",    key: "/" },
  { href: "/blog/",       label: "Blog",       key: "/blog" },
  { href: "/seo-ordbog/", label: "SEO Ordbog", key: "/seo-ordbog" }
];
  const TOOLS = [
    { href: "/serp-preview.html",         label: "SERP & Meta",        key: "/serp-preview.html" },
    { href: "/robots-generator.html",     label: "Robots.txt",         key: "/robots-generator.html" },
    { href: "/sitemap-generator.html",    label: "Sitemap.xml",        key: "/sitemap-generator.html" },
    { href: "/internal-link-builder.html",label: "Intern linkbuilder", key: "/internal-link-builder.html" },
    { href: "/meta-tag-generator.html",   label: "Meta Tag Generator", key: "/meta-tag-generator.html" },
    { href: "/redirect-checker.html",     label: "Redirect Checker",   key: "/redirect-checker.html" },
    { href: "/page-speed-check.html",     label: "Page Speed Check",   key: "/page-speed-check.html" },
    { href: "/tweet-preview.html",        label: "Tweet Preview",      key: "/tweet-preview.html" }
  ];

  // ----- HTML -----
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

      <!-- Desktop nav -->
      <nav id="siteNav"
        class="hidden md:flex items-center gap-4 text-sm text-neutral-700">

        <!-- Venstre simple links -->
        <div class="hidden md:flex items-center gap-4" id="simpleLinks"></div>

        <!-- Desktop dropdown for værktøjer -->
        <div class="relative group hidden md:block" id="toolsDesktop">
          <button id="toolsBtn"
            class="inline-flex items-center gap-2 rounded-lg border px-3 py-2 hover:bg-neutral-50">
            Værktøjer
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <div id="toolsMenu"
               class="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition
                      absolute right-0 mt-2 w-64 rounded-xl border bg-white shadow-lg p-2 z-50">
            <!-- Fyldes i JS -->
          </div>
        </div>
      </nav>
    </div>

    <!-- MOBIL: slide-down menu -->
    <div id="mobilePanel" class="md:hidden hidden border-t bg-white/95 backdrop-blur">
      <div class="max-w-6xl mx-auto p-4 space-y-3 text-sm">

        <!-- Venstre simple links på mobil -->
        <div id="mobileSimple" class="flex flex-col gap-2"></div>

        <!-- Accordion: Værktøjer -->
        <div class="border rounded-lg overflow-hidden">
          <button id="mobToolsToggle"
            class="w-full flex items-center justify-between px-3 py-2 font-medium">
            Værktøjer
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform" id="mobToolsIcon">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <div id="mobToolsList" class="hidden px-2 pb-2">
            <!-- Fyldes i JS -->
          </div>
        </div>

      </div>
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
    if (linkPath === "/") return currentPath === "/" || currentPath === "";
    const lp = normalizePath(linkPath);
    const cp = normalizePath(currentPath);
    return cp === lp || cp.startsWith(lp + "/");
  }

  function closeDesktopDropdown() {
    const menu = document.getElementById('toolsMenu');
    if (menu) { menu.style.visibility = 'hidden'; menu.style.opacity = '0'; }
  }
  function openDesktopDropdown() {
    const menu = document.getElementById('toolsMenu');
    if (menu) { menu.style.visibility = 'visible'; menu.style.opacity = '1'; }
  }

  function mount() {
    // Fjern evt. eksisterende header for at undgå dubletter
    const existing = document.querySelector('header');
    if (existing) existing.remove();

    // Indsæt
    const wrap = document.createElement('div');
    wrap.innerHTML = html;
    document.body.insertBefore(wrap.firstElementChild, document.body.firstChild);

    const current = window.location.pathname;

    // Udfyld simple links (desktop & mobil)
    const $simpleDesktop = document.getElementById('simpleLinks');
    const $simpleMobile  = document.getElementById('mobileSimple');
    LINKS_LEFT.forEach(l => {
      const a1 = document.createElement('a');
      a1.href = l.href; a1.textContent = l.label;
      if (isActive(l.key, current)) a1.className = "font-semibold text-blue-600";
      $simpleDesktop.appendChild(a1);

      const a2 = document.createElement('a');
      a2.href = l.href; a2.textContent = l.label;
      a2.className = "block rounded-lg border px-3 py-2 hover:bg-neutral-50";
      if (isActive(l.key, current)) a2.classList.add("border-blue-200","bg-blue-50");
      $simpleMobile.appendChild(a2);
    });

    // Desktop dropdown liste
    const $menu = document.getElementById('toolsMenu');
    TOOLS.forEach(t => {
      const a = document.createElement('a');
      a.href = t.href;
      a.textContent = t.label;
      a.className = "block rounded-lg px-3 py-2 hover:bg-neutral-50";
      if (isActive(t.key, current)) a.classList.add("font-semibold","text-blue-600");
      $menu.appendChild(a);
    });

    // Desktop interaktion (klik + hover)
    const btn = document.getElementById('toolsBtn');
    const desktop = document.getElementById('toolsDesktop');
    if (btn && desktop) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const visible = $menu.style.visibility === 'visible';
        visible ? closeDesktopDropdown() : openDesktopDropdown();
      });
      desktop.addEventListener('mouseenter', openDesktopDropdown);
      desktop.addEventListener('mouseleave', closeDesktopDropdown);
      document.addEventListener('click', (e) => {
        if (!desktop.contains(e.target)) closeDesktopDropdown();
      });
    }

    // Mobil: burger
    const navToggle = document.getElementById('navToggle');
    const mobilePanel = document.getElementById('mobilePanel');
    const siteNav = document.getElementById('siteNav');
    function openMobile() {
      mobilePanel.classList.remove('hidden');
      siteNav.classList.add('hidden'); // skjul desktop-nav helt på mobil
      navToggle.setAttribute('aria-expanded', 'true');
    }
    function closeMobile() {
      mobilePanel.classList.add('hidden');
      navToggle.setAttribute('aria-expanded', 'false');
    }
    if (navToggle && mobilePanel) {
      navToggle.addEventListener('click', () => {
        const open = navToggle.getAttribute('aria-expanded') === 'true';
        open ? closeMobile() : openMobile();
      });
    }

    // Mobil: Værktøjer accordion
    const mobToggle = document.getElementById('mobToolsToggle');
    const mobList   = document.getElementById('mobToolsList');
    const mobIcon   = document.getElementById('mobToolsIcon');

    // Fyld mobil værktøjsliste
    TOOLS.forEach(t => {
      const a = document.createElement('a');
      a.href = t.href;
      a.textContent = t.label;
      a.className = "block rounded-lg px-3 py-2 hover:bg-neutral-50";
      if (isActive(t.key, current)) a.classList.add("font-semibold","text-blue-600");
      mobList.appendChild(a);
    });

    if (mobToggle && mobList && mobIcon) {
      mobToggle.addEventListener('click', () => {
        const hidden = mobList.classList.contains('hidden');
        if (hidden) {
          mobList.classList.remove('hidden');
          mobIcon.style.transform = "rotate(180deg)";
        } else {
          mobList.classList.add('hidden');
          mobIcon.style.transform = "rotate(0deg)";
        }
      });
    }

    // Luk mobilpanel ved klik på link (bedre UX)
    document.querySelectorAll('#mobilePanel a').forEach(a => {
      a.addEventListener('click', () => closeMobile());
    });

    // Luk mobil ved resize til desktop
    window.addEventListener('resize', () => {
      if (window.matchMedia('(min-width: 768px)').matches) closeMobile();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
