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
    // 1) Brug #footer hvis den findes
    let host = document.getElementById('footer');
    if (host) {
      host.innerHTML = html;
      finalize(host);
      return;
    }

    // 2) Ellers: hvis der findes et <footer>, erstat det med vores markup
    const existingFooter = document.querySelector('footer');
    if (existingFooter) {
      const wrapper = document.createElement('div');
      wrapper.id = 'footer';
      wrapper.innerHTML = html;
      existingFooter.replaceWith(wrapper);
      finalize(wrapper);
      return;
    }

    // 3) Fald tilbage: opret en footer i bunden
    host = document.createElement('div');
    host.id = 'footer';
    host.innerHTML = html;
    document.body.appendChild(host);
    finalize(host);
  }

  function finalize(container) {
    const yearEl = container.querySelector('#footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
