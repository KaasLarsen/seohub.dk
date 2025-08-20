// Robuste loaders til /blog/ — viser fejl PÅ SIDEN og logger trin-for-trin.
// Kræver: #statusBox, #postsList, #rawJson

(function () {
  function elt(id) { return document.getElementById(id); }
  const statusEl = elt('statusBox');
  const listEl   = elt('postsList');
  const rawEl    = elt('rawJson');

  function showStatus(msgHtml) {
    if (!statusEl) return;
    statusEl.innerHTML = msgHtml;
    statusEl.classList.remove('hidden');
  }
  function hideStatus() {
    if (!statusEl) return;
    statusEl.classList.add('hidden');
  }
  function showRaw(label, obj) {
    if (!rawEl) return;
    rawEl.classList.remove('hidden');
    rawEl.textContent = `${label}\n\n` + (typeof obj === 'string' ? obj : JSON.stringify(obj, null, 2));
  }

  function cardTemplate(p) {
    const href = `/blog/${p.slug}.html`;
    const tags = (p.tags || []).map(t => `<span class="px-2 py-1 rounded-full text-xs bg-neutral-100">${t}</span>`).join(' ');
    return `
      <a href="${href}" class="block rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition">
        <div class="text-xs text-neutral-500 mb-1">${p.date || ''}</div>
        <h2 class="text-lg font-semibold leading-snug mb-2">${p.title}</h2>
        <p class="text-sm text-neutral-600 mb-3">${p.excerpt || ''}</p>
        <div class="flex flex-wrap gap-2">${tags}</div>
      </a>
    `;
  }

  function renderPosts(posts) {
    if (!Array.isArray(posts) || posts.length === 0) {
      showStatus(`<span class="text-red-600">Ingen indlæg fundet.</span>
        <span class="text-neutral-500">Tjek at <code>/public/blog/posts.json</code> findes, at den er gyldig JSON, og at der er mindst ét objekt.</span>`);
      return;
    }
    // Valider slugs og log evt. fejl
    const invalid = posts.filter(p => !p || typeof p.slug !== 'string' || !p.slug.trim());
    if (invalid.length) {
      showStatus(`<span class="text-red-600">Ugyldige poster i posts.json.</span>
        <div class="text-neutral-500 mt-1">Mindst ét objekt mangler en gyldig "slug" (string).</div>`);
      showRaw('Ugyldige objekter', invalid);
      return;
    }

    // Sortér nyeste først (forudsætter YYYY-MM-DD)
    posts.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

    // Render
    listEl.innerHTML = posts.map(cardTemplate).join('');
    hideStatus();
  }

  async function fetchPostsJson() {
    const url = `/blog/posts.json?v=${Date.now()}`; // cache-bust
    console.log('[Blog] Fetch:', url);

    try {
      const res = await fetch(url, { cache: 'no-store', credentials: 'same-origin' });
      console.log('[Blog] HTTP:', res.status);
      const txt = await res.text();
      showRaw('posts.json response', txt);

      if (!res.ok) {
        showStatus(`<div class="text-red-600">Kunne ikke hente posts.json (HTTP ${res.status}).</div>
          <div class="text-neutral-500 mt-1">Tjek at filen ligger i <code>/public/blog/posts.json</code>.</div>`);
        return;
      }

      let json;
      try {
        json = JSON.parse(txt);
      } catch (e) {
        console.error('[Blog] JSON parse fejl:', e);
        showStatus(`<div class="text-red-600">posts.json er ikke gyldig JSON.</div>
          <div class="text-neutral-500 mt-1">Fjern trailing kommaer og sørg for korrekte anførselstegn. Se rå svar nedenfor.</div>`);
        return;
      }

      renderPosts(json);
    } catch (err) {
      console.error('[Blog] Netværksfejl:', err);
      showStatus(`<div class="text-red-600">Netværksfejl ved hentning af posts.json.</div>
        <div class="text-neutral-500 mt-1">Er du bag et adblocker/cookie-bloker? Prøv privat vindue.</div>`);
    }
  }

  function init() {
    if (!statusEl || !listEl) {
      console.error('[Blog] Mangler #statusBox eller #postsList i DOM.');
      return;
    }
    fetchPostsJson();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
