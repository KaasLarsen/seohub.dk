// /assets/include-header.js
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

      <!-- Nav -->
      <nav id="siteNav"
        class="hidden md:flex text-sm text-neutral-600 gap-4
               absolute left-0 right-0 top-full bg-white/95 backdrop-blur border-b
               md:static md:border-0 md:bg-transparent md:backdrop-blur-0 md:items-center md:justify-end p-4 md:p-0">
        <a href="/" class="block px-2 py-2 md:p-0">Forside</a>
        <a href="/serp-preview.html" class="block px-2 py-2 md:p-0">SERP</a>
        <a href="/robots-generator.html" class="block px-2 py-2 md:p-0">Robots</a>
        <a href="/sitemap-generator.html" class="block px-2 py-2 md:p-0">Sitemap</a>
        <a href="/internal-link-builder.html" class="block px-2 py-2 md:p-0">Intern links</a>
        <a href="/blog/" class="block px-2 py-2 md:p-0">Blog</a>
        <a href="/kontakt.html" class="block px-2 py-2 md:p-0">Kontakt</a>
      </nav>
    </div>
  </header>
  `;

  function mount() {
    // Fjern evt. eksisterende header for at undgå dubletter
    const existing = document.querySelector('header');
    if (existing) existing.remove();

    // Indsæt ny header øverst i <body>
    const wrap = document.createElement('div');
    wrap.innerHTML = html;
    document.body.insertBefore(wrap.firstElementChild, document.body.firstChild);

    // Toggle adfærd
    const btn = document.getElementById('navToggle');
    const nav = document.getElementById('siteNav');
    if (!btn || !nav) return;

    function closeNav() {
      nav.classList.add('hidden');
      btn.setAttribute('aria-expanded', 'false');
    }
    function openNav() {
      nav.classList.remove('hidden');
      btn.setAttribute('aria-expanded', 'true');
    }
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      open ? closeNav() : openNav();
    });

    // Luk når man klikker et link (mobil)
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        if (window.matchMedia('(max-width: 767px)').matches) closeNav();
      });
    });

    // Luk på Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeNav();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
