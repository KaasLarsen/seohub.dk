// /blog/blog.js
(function () {
  const $posts = document.getElementById('posts');
  const $filter = document.getElementById('tag-filter');

  function showPosts(items) {
    if (!$posts) return;
    if (!Array.isArray(items) || items.length === 0) {
      $posts.innerHTML = '<p class="text-sm text-neutral-600">Ingen indlæg fundet.</p>';
      return;
    }
    $posts.innerHTML = '';
    for (const p of items) {
      const href = `/blog/${p.slug}.html`;
      const date = p.date ? new Date(p.date).toLocaleDateString('da-DK') : '';
      const tags = (p.tags || []).map(t =>
        `<button data-tag="${escapeAttr(t)}" class="tagbtn text-xs bg-neutral-100 border px-2 py-1 rounded-full hover:bg-neutral-200">${escapeHtml(t)}</button>`
      ).join(' ');
      const card = document.createElement('article');
      card.className = "rounded-2xl border p-5 bg-white hover:shadow transition";
      card.innerHTML = `
        <h3 class="text-lg font-semibold"><a class="hover:underline" href="${href}">${escapeHtml(p.title || 'Uden titel')}</a></h3>
        <p class="text-xs text-neutral-500 mt-1">${date}</p>
        ${p.excerpt ? `<p class="text-sm text-neutral-700 mt-3">${escapeHtml(p.excerpt)}</p>` : ''}
        <div class="flex gap-2 mt-3 flex-wrap">${tags}</div>
        <a class="inline-block mt-4 text-blue-600 hover:underline" href="${href}">Læs mere →</a>
      `;
      $posts.appendChild(card);
    }
    // klik på tag-chips i kort = aktiver filter
    $posts.querySelectorAll('.tagbtn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tag = e.currentTarget.getAttribute('data-tag');
        setActiveTag(tag);
      });
    });
  }

  function renderFilter(allItems, activeTag) {
    if (!$filter) return;
    const freq = {};
    for (const p of allItems) for (const t of (p.tags || [])) {
      freq[t] = (freq[t] || 0) + 1;
    }
    const tags = Object.keys(freq).sort((a,b)=>a.localeCompare(b,'da'));

    const mkBtn = (label, tagValue, isActive) =>
      `<button data-tag="${tagValue ?? ''}" class="px-3 py-1.5 rounded-full border text-sm ${isActive ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-neutral-50'}">${label}</button>`;

    const buttons = [
      mkBtn('Alle', '', !activeTag),
      ...tags.map(t => mkBtn(`${t} (${freq[t]})`, escapeAttr(t), activeTag === t))
    ].join(' ');

    $filter.innerHTML = buttons;

    $filter.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const t = e.currentTarget.getAttribute('data-tag') || '';
        setActiveTag(t || null);
      });
    });
  }

  function getActiveTagFromURL() {
    const u = new URL(location.href);
    const t = u.searchParams.get('tag');
    return t && t.trim() ? t.trim() : null;
  }
  function pushTagToURL(tag) {
    const u = new URL(location.href);
    if (tag) u.searchParams.set('tag', tag);
    else u.searchParams.delete('tag');
    history.replaceState(null, '', u.toString());
  }

  function setActiveTag(tag) {
    state.activeTag = tag && tag.length ? tag : null;
    pushTagToURL(state.activeTag);
    apply();
  }

  function apply() {
    const list = (!state.activeTag)
      ? state.items
      : state.items.filter(p => (p.tags || []).includes(state.activeTag));
    renderFilter(state.items, state.activeTag);
    showPosts(list);
  }

  function escapeHtml(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}
  function escapeAttr(s){return String(s).replace(/"/g,"&quot;")}

  const state = { items: [], activeTag: getActiveTagFromURL() };

  async function init() {
    try {
      // skeleton while loading
      if ($posts) {
        $posts.innerHTML = [0,1,2,3].map(i => `<div class="rounded-2xl border p-5 bg-white animate-pulse h-40"></div>`).join('');
      }
      const res = await fetch('/blog/posts.json?ts=' + Date.now(), { cache: 'no-store' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('Ugyldig JSON');
      state.items = data.slice().sort((a,b) => (a.date < b.date ? 1 : -1));
      apply();
    } catch (e) {
      console.error('Blog loader fejl:', e);
      if ($posts) $posts.innerHTML = '<p class="text-sm text-neutral-600">Kunne ikke indlæse indlæg lige nu.</p>';
      if ($filter) $filter.innerHTML = '';
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
