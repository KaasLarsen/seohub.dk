// /assets/include-footer.js
(function () {
  const html = `
    <footer class="mt-12 border-t bg-white/80 backdrop-blur">
      <div class="max-w-6xl mx-auto p-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
        <p>© <span id="footer-year"></span> Seohub – seohub.dk</p>
        <nav class="flex items-center gap-4">
          <a class="hover:underline" href="/blog/">Blog</a>
          <a class="hover:underline" href="/om-os.html">Om os</a>
          <a class="hover:underline" href="/privatliv-cookies.html">Privatliv & cookies</a>
          <a class="hover:underline" href="mailto:info@seohub.dk">Kontakt</a>
        </nav>
      </div>
    </footer>
  `;

  function mount() {
    // Find eksisterende <footer> og ERSTAT hele elementet
    const existing = document.querySelector('footer');
    if (existing) {
      existing.outerHTML = html;
    } else {
      // Ellers tilføj i bunden
      const wrap = document.createElement('div');
      wrap.innerHTML = html;
      document.body.appendChild(wrap.firstElementChild);
    }

    // Sæt årstal
    const yf = document.querySelector('#footer-year');
    if (yf) yf.textContent = new Date().getFullYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
