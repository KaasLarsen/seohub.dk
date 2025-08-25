// /assets/include-header.js (v7 komplet)
(function () {
  const NAV_TOOLS = [
    { href: "/serp-preview.html",         label: "SERP & Meta",             key: "/serp-preview.html" },
    { href: "/robots-generator.html",     label: "Robots.txt",              key: "/robots-generator.html" },
    { href: "/sitemap-generator.html",    label: "Sitemap.xml",             key: "/sitemap-generator.html" },
    { href: "/internal-link-builder.html",label: "Intern linkbuilder",      key: "/internal-link-builder.html" },
    { href: "/meta-tag-generator.html",   label: "Meta Tag Generator",      key: "/meta-tag-generator.html" },
    { href: "/redirect-checker.html",     label: "Redirect Checker",        key: "/redirect-checker.html" },
    { href: "/page-speed-check.html",     label: "Page Speed Check",        key: "/page-speed-check.html" },

    // Nye værktøjer
    { href: "/canonical-checker.html",    label: "Canonical Checker",       key: "/canonical-checker.html" },
    { href: "/og-preview.html",           label: "Open Graph Preview",      key: "/og-preview.html" },
    { href: "/schema-faq-generator.html", label: "FAQ Schema Generator",    key: "/schema-faq-generator.html" },
    { href: "/twitter-card-generator.html", label: "Twitter Card Preview",  key: "/twitter-card-generator.html" }
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

      <!-- Desktop nav -->
      <nav id="siteNav"
        class="hidden md:flex text-sm text-neutral-600 gap-4
               absolute left-0 right-0 top-full bg-white/95 backdrop-blur border-b
               md:static md:border-0 md:bg-transparent md:backdrop-blur-0 md:items-center md:justify-end p-4 md:p-0">
        <a href="/" data-page="/">Forside</a>
        <div class="relative group">
          <button class="flex items-center gap-1">Værktøjer ▼</button>
          <div class="absolute left-0 mt-2 hidden group-hover:block bg-white border rounded-lg shadow-lg p-2 space-y-1 w-56 z-50">
            ${NAV_TOOLS.map(t =>
              `<a href="${t.href}" data-page="${t.key}" class="block px-3 py-1 hover:bg-neutral-100 rounded">${t.label}</a>`
            ).join("")}
          </div>
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
    if (linkPath === "/") return currentPath === "/" || currentPath === "";
    const lp = normalizePath(linkPath);
    const cp = normalizePath(currentPath);
    return cp === lp || cp.startsWith(lp + "/");
  }

  function mount() {
    const existing = document.querySelector('header');
    if (existing) existing.remove();

    const wrap = document.createElement('div');
    wrap.innerHTML = html;
    document.body.insertBefore(wrap.firstElementChild, document.body.firstChild);

    const btn = document.getElementById('navToggle');
    const nav = document.getElementById('siteNav');

    function closeNav() { nav.classList.add('hidden'); btn.setAttribute('aria-expanded','false'); }
    function openNav() { nav.classList.remove('hidden'); btn.setAttribute('aria-expanded','true'); }

    if (btn && nav) {
      btn.addEventListener('click', () => {
        const open = btn.getAttribute('aria-expanded') === 'true';
        open ? closeNav() : openNav();
      });

      nav.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          if (window.matchMedia('(max-width: 767px)').matches) closeNav();
        });
      });

      document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });
      window.addEventListener('resize', () => {
        if (window.matchMedia('(min-width: 768px)').matches) closeNav();
      });
    }

    const current = window.location.pathname;
    nav.querySelectorAll('a[data-page]').forEach(link => {
      const lp = link.getAttribute('data-page') || "";
      if (isActive(lp, current)) {
        link.classList.add("font-semibold", "text-blue-600");
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
