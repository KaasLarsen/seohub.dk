document.addEventListener("DOMContentLoaded", function () {
  const footer = document.createElement("footer");
  footer.className =
    "mt-12 border-t bg-white/80 backdrop-blur text-neutral-600 text-sm";

  footer.innerHTML = `
    <!-- Sponsoreret tip -->
    <div class="bg-neutral-50 border-b p-4 text-center">
      <p class="mb-2 font-medium text-neutral-800">💡 Sponsoreret tip</p>
      <a href="https://www.partner-ads.com/dk/klikbanner.php?partnerid=55078&bannerid=96386" target="_blank" rel="nofollow noopener">
        <img src="https://www.partner-ads.com/dk/visbanner.php?partnerid=55078&bannerid=96386" alt="Anbefalet partner" class="mx-auto rounded shadow-md">
      </a>
    </div>

    <!-- Standard footer -->
    <div class="max-w-6xl mx-auto p-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
      <p>© 2025 Seohub – seohub.dk</p>
      <nav class="flex items-center gap-4">
        <a class="hover:underline" href="/blog/">Blog</a>
        <a class="hover:underline" href="/privatliv-cookies.html">Privatliv & cookies</a>
        <a class="hover:underline" href="/om-os.html">Om os</a>
        <a class="hover:underline" href="/kontakt.html">Kontakt</a>
      </nav>
    </div>
  `;

  document.body.appendChild(footer);
});
