// /assets/include-header.js

document.addEventListener("DOMContentLoaded", () => {
  const header = `
    <header class="border-b bg-white/80 backdrop-blur sticky top-0 z-40">
      <div class="max-w-6xl mx-auto p-4 flex items-center justify-between">
        <a href="/" class="font-semibold text-lg">Seohub.dk</a>
        <nav class="text-sm text-neutral-600 space-x-4 hidden md:flex">
          <a href="/" data-page="/">Forside</a>
          <a href="/serp-preview.html" data-page="/serp-preview.html">SERP</a>
          <a href="/robots-generator.html" data-page="/robots-generator.html">Robots</a>
          <a href="/sitemap-generator.html" data-page="/sitemap-generator.html">Sitemap</a>
          <a href="/internal-link-builder.html" data-page="/internal-link-builder.html">Intern links</a>
          <a href="/blog/" data-page="/blog/">Blog</a>
          <a href="/om-os.html" data-page="/om-os.html">Om os</a>
          <a href="/kontakt.html" data-page="/kontakt.html">Kontakt</a>
        </nav>
        <!-- Mobile menu button -->
        <button id="mobileMenuBtn" class="md:hidden text-neutral-700">
          ☰
        </button>
      </div>
      <!-- Mobile dropdown -->
      <div id="mobileMenu" class="hidden md:hidden px-4 pb-4 space-y-2 text-sm text-neutral-600">
        <a href="/" data-page="/">Forside</a><br>
        <a href="/serp-preview.html" data-page="/serp-preview.html">SERP</a><br>
        <a href="/robots-generator.html" data-page="/robots-generator.html">Robots</a><br>
        <a href="/sitemap-generator.html" data-page="/sitemap-generator.html">Sitemap</a><br>
        <a href="/internal-link-builder.html" data-page="/internal-link-builder.html">Intern links</a><br>
        <a href="/blog/" data-page="/blog/">Blog</a><br>
        <a href="/om-os.html" data-page="/om-os.html">Om os</a><br>
        <a href="/kontakt.html" data-page="/kontakt.html">Kontakt</a>
      </div>
    </header>
  `;

  document.body.insertAdjacentHTML("afterbegin", header);

  // Marker aktiv side
  const path = window.location.pathname;
  document.querySelectorAll("nav a, #mobileMenu a").forEach(link => {
    if (path === link.getAttribute("data-page")) {
      link.classList.add("font-semibold", "text-blue-600");
    }
  });

  // Mobile menu toggle
  const mobileBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }
});
