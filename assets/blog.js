(function () {
  const el = document.getElementById('posts');
  function show(msg) {
    if (!el) return;
    el.innerHTML = '<p class="text-sm text-neutral-600">' + msg + '</p>';
  }

  async function load() {
    try {
      const res = await fetch('/blog/posts.json?ts=' + Date.now(), { cache: 'no-store' });
      if (!res.ok) {
        console.error('HTTP status:', res.status, res.statusText);
        show('Kunne ikke indlæse indlæg (HTTP ' + res.status + ').');
        return;
      }
      const text = await res.text();
      let items;
      try { items = JSON.parse(text); }
      catch (e) {
        console.error('JSON parse-fejl:', e, text.slice(0,200));
        show('Indlæste filen, men den var ikke gyldig JSON.');
        return;
      }

      if (!Array.isArray(items) || items.length === 0) {
        show('Ingen indlæg endnu.');
        return;
      }

      items.sort((a,b) => (a.date < b.date ? 1 : -1));
      el.innerHTML = '';
      for (const p of items) {
        const slug = (p.slug || '').trim();
        const title = p.title || 'Uden titel';
        const date = p.date ? new Date(p.date).toLocaleDateString('da-DK') : '';
        const excerpt = p.excerpt || '';
        const tags = (p.tags || []).map(t =>
          `<span class="text-xs bg-neutral-100 border px-2 py-1 rounded-full">${t}</span>`
        ).join(' ');
        const url = `/blog/${slug}.html`;

        const card = document.createElement('article');
        card.className = "rounded-2xl border p-5 bg-white hover:shadow transition";
        card.innerHTML = `
          <h3 class="text-lg font-semibold"><a class="hover:underline" href="${url}">${title}</a></h3>
          <p class="text-xs text-neutral-500 mt-1">${date}</p>
          <p class="text-sm text-neutral-700 mt-3">${excerpt}</p>
          <div class="flex gap-2 mt-3 flex-wrap">${tags}</div>
          <a class="inline-block mt-4 text-blue-600 hover:underline" href="${url}">Læs mere →</a>
        `;
        el.appendChild(card);
      }
    } catch (e) {
      console.error(e);
      show('Kunne ikke indlæse indlæg lige nu.');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load);
  } else {
    load();
  }
})();
