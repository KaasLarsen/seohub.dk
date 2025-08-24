// /assets/blog-sidebar-sponsor.js (v2)
// Indsætter en "Sponsoreret anbefaling"-boks under TOC i højre kolonne.
// Robust: virker med/uden .lg:sticky, og har fallback til <aside> eller <main>.

(function () {
  function makeSponsorBox() {
    const box = document.createElement('div');
    box.setAttribute('data-sponsor-box', '1');
    box.className = "rounded-2xl p-5 md:p-6 text-white shadow-lg mt-6";
    box.style.background = "linear-gradient(135deg,#0ea5e9 0%,#6366f1 60%,#8b5cf6 100%)";
    box.innerHTML = `
      <div class="text-[11px] uppercase tracking-wide mb-2 opacity-90">Sponsoreret anbefaling</div>
      <h3 class="text-lg md:text-xl font-extrabold mb-2">AI Links – find smartere linkmuligheder</h3>
      <p class="text-blue-100 mb-3 text-sm">
        AI-drevet linkanalyse der sparer tid i outreach. Find relevante domæner og prioritér indsats smartere.
      </p>
      <a href="https://www.partner-ads.com/dk/klikbanner.php?partnerid=55078&bannerid=108555"
         target="_blank" rel="sponsored noopener nofollow"
         class="inline-flex items-center gap-2 bg-white text-neutral-900 px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition text-sm">
        Besøg AI Links
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
             class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round">
          <path d="M7 17L17 7" /><path d="M7 7h10v10" />
        </svg>
      </a>
    `;
    return box;
  }

  function mount() {
    // Undgå dubletter
    if (document.querySelector('[data-sponsor-box="1"]')) return;

    // 1) Foretrukket: under sticky TOC-containeren
    let target = document.querySelector('aside .lg\\:sticky');
    // 2) Ellers i aside-kolonnen
    if (!target) target = document.querySelector('aside');
    // 3) Fallback: i bunden af main (fuld bredde – hellere vist end skjult)
    if (!target) target = document.querySelector('main');

    if (!target) return; // ingen passende container fundet
    target.appendChild(makeSponsorBox());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
