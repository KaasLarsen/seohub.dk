// /assets/post.js
(function () {
  function text(el){return (el.textContent||"").trim();}
  function slugify(str){return str.toLowerCase().trim().replace(/[^\w\s-]/g,"").replace(/\s+/g,"-");}
  function readingTime(words){const wpm=200;return Math.max(1,Math.round(words/wpm));}

  document.addEventListener('DOMContentLoaded', () => {
    // Indholdsfortegnelse
    const toc = document.getElementById('toc');
    const article = document.querySelector('article');
    if (toc && article) {
      const heads = article.querySelectorAll('h2, h3');
      const ul = document.createElement('ul');
      ul.className = "space-y-2";
      heads.forEach(h => {
        if (!h.id) h.id = slugify(text(h));
        const li = document.createElement('li');
        li.innerHTML = `<a class="text-blue-600 hover:underline" href="#${h.id}">${text(h)}</a>`;
        if (h.tagName.toLowerCase()==='h3') li.style.marginLeft='1rem';
        ul.appendChild(li);
        // Klikbart #-anker ved hover
        const a = document.createElement('a');
        a.href = `#${h.id}`;
        a.textContent = ' #';
        a.className = 'opacity-0 group-hover:opacity-100 text-neutral-300 hover:text-blue-600';
        const wrap = document.createElement('span');
        wrap.className = 'group';
        h.appendChild(wrap);
        wrap.appendChild(a);
      });
      toc.appendChild(ul);
    }

    // Læsetid
    const meta = document.getElementById('post-meta');
    if (meta && article) {
      const words = text(article).split(/\s+/).filter(Boolean).length;
      const mins = readingTime(words);
      const t = meta.querySelector('[data-reading]');
      if (t) t.textContent = `${mins} min`;
    }
  });
})();
