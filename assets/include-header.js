// /assets/include-header.js (v3) — mobil burger + aktivt link

(function () {
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
        <a href="/serp-preview.html" data-page="/serp-preview.html">SERP</a>
        <a href="/robots-generator.html" data-page="/robots-generator.html">Robots</a>
        <a href="/sitemap-generator.html" data-page="/sitemap-generator.html">Sitemap</a>
        <a href="/internal-link-builder.html" data-page="/internal-link-builder.html">Intern links</a>
        <a href="/blog/" data-page="/blog/">Blog</a>
      </nav>
    </div>
  </header>
  `;

  function normalizePath(p) {
    // Fjern trailing "index.html" og trailing slash (undtagen root)
    if (!p) return "/";
    let out = p.replace(/index\.html$/i, "");
    if (out.length > 1 && out.endsWith("/")) out = out.slice(0, -1);
    return out || "/";
  }

  function isActive(linkPath, currentPath) {
    // Root
    if (linkPath === "/") {
      return currentPath === "/" || currentPath === "";
    }
    // Blog og andre "sektioner" – marker hvis current starter med linkPath som mappe
    // Sørg for at sammenligne normaliseret:
    const lp = normalizePath(linkPath);
    const cp = normalizePath(currentPath);
    // Match præcis side (fx /serp-preview.html) eller mappe (fx /blog → /blog/xyz)
    return cp === lp || cp.startsWith(lp + "/");
  }

  function mount() {
    // Fjern eksisterende header for at undgå dubletter
    const existing = document.querySelector('header');
    if (existing) existing.remove();

    // Indsæt ny header øverst
    const wrap = document.createElement('div');
    wrap.innerHTML = html;
    document.body.insertBefore(wrap.firstElementChild, document.body.firstChild);

    const btn = document.getElementById('navToggle');
    const nav = document.getElementById('siteNav');

    // Toggle menu (mobil)
    function closeNav() { nav.classList.add('hidden'); btn.setAttribute('aria-expanded','false'); }
    function openNav() { nav.classList.remove('hidden'); btn.setAttribute('aria-expanded','true'); }

    if (btn && nav) {
      btn.addEventListener('click', () => {
        const open = btn.getAttribute('aria-expanded') === 'true';
        open ? closeNav() : openNav();
      });

      // Luk ved klik på link på mobil
      nav.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          if (window.matchMedia('(max-width: 767px)').matches) closeNav();
        });
      });

      // Luk på Escape
      document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });
      // Luk hvis man resizer op til desktop
      window.addEventListener('resize', () => {
        if (window.matchMedia('(min-width: 768px)').matches) closeNav();
      });
    }

    // Aktivt link highlight
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
