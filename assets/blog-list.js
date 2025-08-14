// /assets/blog-list.js (DEBUG)
(function () {
  const out = document.getElementById('blog-list');
  if (!out) return;

  const url = '/blog/posts.json?ts=' + Date.now();
  fetch(url, { cache: 'no-store' })
    .then(res => {
      if (!res.ok) throw new Error('Fetch fejl: ' + res.status + ' ' + res.statusText);
      return res.text();
    })
    .then(text => {
      try {
        const posts = JSON.parse(text);
        if (!Array.isArray(posts) || posts.length === 0) {
          out.innerHTML = '<p class="col-span-full text-center text-neutral-500">Ingen indlæg endnu (JSON tom).</p>';
          return;
        }
        posts.sort((a, b) => (a.date < b.date ? 1 : -1));
        const frag = document.createDocumentFragment();
        posts.forEach(post => {
          const a = document.createElement('a');
          a.href = `/blog/${post.slug}.html`;
          a.className = 'block bg-white rounded-xl border shadow-sm hover:shadow transition p-6 h-full';
          const dateStr = post.date ? new Date(post.date).toLocaleDateString('da-DK') : '';
          const tagsHtml = (post.tags || [])
            .map(t => `<span class="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded mr-2 mb-2">${t}</span>`)
            .join('');
          a.innerHTML = `
            <h2 class="text-xl font-semibold mb-2">${post.title || ''}</h2>
            <p class="text-sm text-neutral-500 mb-3">${dateStr}</p>
            <p class="text-neutral-700 mb-4">${post.excerpt || ''}</p>
            <div class="mt-auto">${tagsHtml}</div>
            <span class="inline-block mt-4 text-blue-600">Læs mere →</span>
          `;
          frag.appendChild(a);
        });
        out.innerHTML = '';
        out.appendChild(frag);
      } catch (e) {
        console.error('JSON parse fejl:', e, '\nRå tekst:', text);
        out.innerHTML = '<p class="col-span-full text-center text-red-500">JSON-fejl: Kan ikke parse posts.json. Tjek kommaer og format.</p>';
      }
    })
    .catch(err => {
      console.error('Blog-list fetch fejl:', err);
      out.innerHTML = `<div class="col-span-full text-center">
        <p class="text-red-600 font-semibold">Fejl ved indlæsning af indlæg.</p>
        <p class="text-sm text-neutral-600 mt-1">${String(err)}</p>
        <p class="text-xs text-neutral-400 mt-1">URL: ${url}</p>
      </div>`;
    });
})();
