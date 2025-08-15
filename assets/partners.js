// partners.js — indsæt “Vores partnere” lige under hero-sektionen i app’ens <main>
(function () {
  const partners = [
    {
      name: "AI Links",
      href: "https://www.partner-ads.com/dk/klikbanner.php?partnerid=55078&bannerid=108555",
      tagline: "AI-drevne backlinks – smartere linkbuilding til SEO."
    },
    {
      name: "Nemlinkbuilding.dk",
      href: "https://www.partner-ads.com/dk/klikbanner.php?partnerid=55078&bannerid=87346",
      tagline: "Kvalitetslinks uden bøvl – nem bestilling og hurtig levering."
    },
    {
      name: "CLKWEB",
      href: "https://www.partner-ads.com/dk/klikbanner.php?partnerid=55078&bannerid=99810",
      tagline: "E-commerce & Magento-eksperter – få en shop der performer."
    }
  ];

  function makeIcon(text) {
    // lille rund “logo”-chip med initialer, så vi undgår eksterne billeder
    const initials = text.split(/\s|-/).map(s=>s[0]?.toUpperCase()).filter(Boolean).slice(0,3).join('');
    const span = document.createElement('span');
    span.className = "mx-auto mb-3 inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-600 text-white font-semibold";
    span.textContent = initials;
    return span;
  }

  function buildSection() {
    const wrap = document.createElement('section');
    wrap.setAttribute('data-partners', 'true');
    wrap.className = "max-w-6xl mx-auto px-4 pb-4";

    const card = document.createElement('div');
    card.className = "bg-white/70 backdrop-blur rounded-2xl shadow p-6 md:p-8 border border-neutral-100";

    const h2 = document.createElement('h2');
    h2.className = "text-2xl font-bold mb-6 text-center";
    h2.textContent = "Vores partnere";

    const grid = document.createElement('div');
    grid.className = "grid grid-cols-1 md:grid-cols-3 gap-6";

    for (const p of partners) {
      const box = document.createElement('div');
      box.className = "border rounded-2xl shadow hover:shadow-lg transition p-5 text-center";
      const label = document.createElement('span');
      label.className = "text-[11px] uppercase tracking-wide text-neutral-500 block mb-2";
      label.textContent = "Sponsoreret";

      const a = document.createElement('a');
      a.href = p.href;
      a.target = "_blank";
      a.rel = "sponsored noopener";
      a.className = "block focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-xl";

      const icon = makeIcon(p.name);

      const h3 = document.createElement('h3');
      h3.className = "text-lg font-semibold mb-1";
      h3.textContent = p.name;

      const tg = document.createElement('p');
      tg.className = "text-sm text-neutral-600";
      tg.textContent = p.tagline;

      a.appendChild(icon);
      a.appendChild(h3);
      a.appendChild(tg);

      box.appendChild(label);
      box.appendChild(a);
      grid.appendChild(box);
    }

    card.appendChild(h2);
    card.appendChild(grid);
    wrap.appendChild(card);
    return wrap;
  }

  function insertAfterHero() {
    const root = document.getElementById('root');
    if (!root) return;

    // vent til React har renderet <main> og første sektion (hero)
    const tryInsert = () => {
      const main = root.querySelector('main');
      if (!main) return false;
      if (main.querySelector('section[data-partners="true"]')) return true; // allerede indsat

      const hero = main.firstElementChild; // i app.js er første <Section> = hero
      if (!hero) return false;

      hero.insertAdjacentElement('afterend', buildSection());
      return true;
    };

    if (!tryInsert()) {
      // hvis app’en ikke er klar endnu, så prøv kort efter
      let tries = 0;
      const iv = setInterval(() => {
        tries++;
        if (tryInsert() || tries > 30) clearInterval(iv);
      }, 100);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', insertAfterHero);
  } else {
    insertAfterHero();
  }
})();
