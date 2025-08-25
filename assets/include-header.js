// /assets/include-header.js (v7.3) — én kilde til både desktop og mobil, med burger og aktiv markering
(function () {
  // --- 1) DINE LINKS: redigér kun her ---
  const NAV_ITEMS = [
    { href: "/", label: "Forside", key: "/" },
    { href: "/serp-preview.html", label: "SERP", key: "/serp-preview.html" },
    { href: "/robots-generator.html", label: "Robots", key: "/robots-generator.html" },
    { href: "/sitemap-generator.html", label: "Sitemap", key: "/sitemap-generator.html" },
    { href: "/internal-link-builder.html", label: "Intern links", key: "/internal-link-builder.html" },
    { href: "/meta-tag-generator.html", label: "Meta tags", key: "/meta-tag-generator.html" },
    { href: "/page-speed-check.html", label: "Page Speed", key: "/page-speed-check.html" },
    { href: "/redirect-checker.html", label: "Redirect Checker", key: "/redirect-checker.html" },
    { href: "/blog/", label: "Blog", key: "/blog" }
  ];

  // --- 2) Skabelon ---
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
      <!-- Links kommer ind her via JS -->
    </nav>
  </div>
</header>`;

  // --- 3) Utils ---
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

  // --- 4) Mount ---
  function mount() {
    // Fjern eksisterende header for at undgå dubletter
    const old = document.querySelector("header");
    if (old) old.remove();

    // Indsæt ny header øverst
    const wrap = document.createElement("div");
    wrap.innerHTML = html;
    const header = wrap.firstElementChild;
    document.body.insertBefore(header, document.body.firstChild);

    const nav = header.querySelector("#siteNav");
    const btn = header.querySelector("#navToggle");

    // Indsæt links (samme til desktop/mobil)
    const frag = document.createDocumentFragment();
    const current = window.location.pathname;
    NAV_ITEMS.forEach(item => {
      const a = document.createElement("a");
      a.href = item.href;
      a.textContent = item.label;
      a.setAttribute("data-page", item.key || item.href);
      a.className = "block md:inline-block px-2 py-2 rounded hover:bg-neutral-50";
      if (isActive(item.key || item.href, current)) {
        a.classList.add("font-semibold", "text-blue-600");
      }
      frag.appendChild(a);
    });
    nav.appendChild(frag);

    // Burger toggle
    function closeNav() {
      nav.classList.add("hidden");
      btn?.setAttribute("aria-expanded", "false");
      document.body.classList.remove("overflow-hidden");
    }
    function openNav() {
      nav.classList.remove("hidden");
      btn?.setAttribute("aria-expanded", "true");
      document.body.classList.add("overflow-hidden"); // lås body scroll
    }
    btn?.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") === "true";
      open ? closeNav() : openNav();
    });

    // Luk når man klikker et link (på mobil)
    nav.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        if (window.matchMedia("(max-width: 767px)").matches) closeNav();
      });
    });

    // Luk på Escape
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeNav(); });

    // Luk hvis man resizer op til desktop
    window.addEventListener("resize", () => {
      if (window.matchMedia("(min-width: 768px)").matches) closeNav();
    });

    // Gør mobilmenu scroll-bar venlig
    nav.style.maxHeight = "75vh";
    nav.style.overflowY = "auto";
    nav.style.webkitOverflowScrolling = "touch";
  }

  // --- 5) Kør mount ---
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
