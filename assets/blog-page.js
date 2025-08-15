// /assets/blog-page.js — CSP-venlig loader til /blog/posts.json
(function () {
  function byId(id){ return document.getElementById(id); }
  const grid = byId('blog-grid');
  const status = byId('blog-status');

  function showError(msg) {
    if (!status) return;
    status.textContent = msg;
    status.className = "text-sm text-red-700 mb-4";
  }
  function clearStatus() {
    if (!status) return;
    status.textContent = "";
    status.className = "text-sm text-neutral-600 mb-4";
  }

  async function loadPostsJson() {
    // Brug fetch (ingen JSON-modul = ingen type="module" = ingen inline script)
    const res = await fetch('/blog/posts.json?ts=' + Date.now(), { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  }

  function render(posts) {
    if (!grid) return;
    if (!Array.isArray(posts) || posts.length === 0) {
      showError('Ingen indlæg fundet. Tilføj objekter i /blog/posts.json.');
      return;
    }

    // sortér seneste først på ISO-dato string
    posts.sort((a,b) => String(b.date).localeCompare(String(a.date)));

    const frag = document.createDocumentFragment();
    for (const p of posts) {
      const href = `/blog/${p.slug}.html`;
      const card = document.createElement('a');
      card.href = href;
      card.className = "rounded-2xl border p-4 bg-white hover:shadow transition flex flex-col";

      const title = document.createElement('h3');
      title.className = "font-semibold mb-2";
      title.textContent = p.title || p.slug;

      const meta = document.createElement('p');
      meta.className = "text-xs text-neutral-500 mb-2";
      meta.textContent = p.date ? new Date(p.date).toLocaleDateString('da-DK', { year:'numeric', month:'long', day:'numeric' }) : '';

      const excerpt = document.createElement('p');
      excerpt.className = "text-sm text-neutral-700 flex-1";
      excerpt.textContent = p.excerpt || '';

      const tagsWrap = document.createElement('div');
      tagsWrap.className = "mt-3 flex flex-wrap gap-2";
      (p.tags || []).slice(0,4).forEach(t => {
        const tag = document.createElement('span');
        tag.className = "text-xs px-2 py-1 rounded-full bg-neutral-100 border";
        tag.textContent = t;
        tagsWrap.appendChild(tag);
      });

      card.appendChild(title);
      if (meta.textContent) card.appendChild(meta);
      card.appendChild(excerpt);
      if (tagsWrap.childNodes.length) card.appendChild(tagsWrap);

      frag.appendChild(card);
    }
    grid.innerHTML = "";
    grid.appendChild(frag);
    clearStatus();
  }

  // Kør når DOM er klar (defer garanterer typisk dette, men vi er ekstra sikre)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  async function init() {
    try {
      const posts = await loadPostsJson();
      render(posts);
    } catch (err) {
      console.error(err);
      showError('Kunne ikke hente blogindlæg. Tjek at /blog/posts.json findes og er gyldig JSON.');
    }
  }
})();
