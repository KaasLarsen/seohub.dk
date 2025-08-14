// /assets/blog-list.js
(function () {
  const out = document.getElementById('blog-list');
  if (!out) return;

  fetch('/blog/posts.json?ts=' + Date.now(), { cache: 'no-store' })
    .then(res => {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(posts => {
      if (!Array.isArray(posts) || posts.length === 0) {
        out.innerHTML = '<p class="col-span-full text-center text-neutral-500">Ingen indlæg endnu.</p>';
        return;
      }

      // Seneste først
      posts.sort((a, b) => (a.date < b.date ? 1 : -1));

      const frag = document.createDocumentFragment();
      posts.forEach(post => {
        const a = document.createElement('a');
        a.href = `/blog/${post.slug}.html`;
        a.className = 'block bg-white rounded-xl shadow hover:shadow-md transition p-6 flex flex-col justify-between';
        a.innerHTML = `
          <div>
            <h2 class="text-xl font-semibold mb-2">${post.title || ''}</h2>
            <p class="text-sm text-neutral-500 mb-4">${post.date ? new Date(post.date).toLocaleDateString('da-DK') : ''}</p>
            <p class="text-neutral-700 mb-4">${post.excerpt || ''}</p>
          </div>
          <div class="mt-auto">
            ${(post.tags || []).map(t => `<span class="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded mr-2">${t}</span>`).join('')}
          </div>
        `;
        frag.appendChild(a);
      });
      out.innerHTML = '';
      out.appendChild(frag);
    })
    .catch(err => {
      console.error(err);
      out.innerHTML = '<p class="col-span-full text-center text-red-500">Fejl ved indlæsning af indlæg.</p>';
    });
})();
