<script>
// /assets/include-footer.js
(function () {
  // Byg HTML’en til footeren
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
    // Hvis siden har et dedikeret #footer-element, brug det.
    let host = document.getElementById('footer');
    if (!host) {
      // Ellers opret et nederst på siden (ændrer ikke andet indhold)
      host = document.createElement('div');
      document.body.appendChild(host);
    }
    host.innerHTML = html;
    const yearEl = host.querySelector('#footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
</script>
