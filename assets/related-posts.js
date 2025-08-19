// /assets/related-posts.js  (v1)
(function () {
  const LIST_SELECTOR = '#related-list';
  const BOX_SELECTOR = '#related-posts';
  const POSTS_JSON = '/blog/posts.json?v=rel-1'; // cache-bust

  function getCurrentSlug() {
    const last = (location.pathname.split('/').pop() || '').toLowerCase();
    return last.replace(/\.html$/, '');
  }
  function parseDate(d) {
    const t = Date.parse(d);
    return isNaN(t) ? 0 : t;
  }
  function scoreByTags(post, current) {
    if (!current || !Array.isArray(current.tags) || !Array.isArray(post.tags)) return 0;
    const set = new Set(current.tags.map(String));
    return post.tags.reduce((acc, tag) => acc + (set.has(String(tag)) ? 1 : 0), 0);
  }
  async function loadPosts() {
    const res = await fetch(POSTS_JSON, { cache: 'no-store' });
    if (!res.ok) throw new Error('Kunne ikke hente posts.json');
    return res.json();
  }
  function renderRelated(listEl, posts) {
    listEl.innerHTML = '';
    if (!posts.length) {
      listEl.innerHTML = '<li class="text-neutral-500">Ingen relaterede indlæg endnu.</li>';
      return;
    }
    posts.forEach(p => {
      const li = document.createElement('li');
      li.innerHTML = `
        <a href="/blog/${p.slug}.html" class="block hover:underline">${p.title}</a>
        <span class="block text-xs text-neutral-500">${p.date ?? ''}</span>
      `;
      listEl.appendChild(li);
    });
  }
  async function init() {
    const box = document.querySelector(BOX_SELECTOR);
    const list = document.querySelector(LIST_SELECTOR);
    if (!box || !list) return;

    try {
      const all = await loadPosts();
      const slug = getCurrentSlug();
      const current = all.find(p => p.slug === slug);
      const others = all.filter(p => p.slug !== slug);

      const scored = others
        .map(p => ({ ...p, __score: scoreByTags(p, current), __date: parseDate(p.date) }))
        .sort((a, b) => (b.__score - a.__score) || (b.__date - a.__date));

      const top = (scored.some(p => p.__score > 0)
        ? scored
        : others.map(p => ({ ...p, __date: parseDate(p.date) })).sort((a, b) => b.__date - a.__date)
      ).slice(0, 3);

      renderRelated(list, top);
    } catch (e) {
      document.querySelector(BOX_SELECTOR)?.classList.add('hidden');
      console.warn('Relaterede indlæg fejlede:', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
