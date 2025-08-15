// /assets/include-header.js
(function () {
  const PARTIAL_URL = '/partials/header.html';

  function el(tag, attrs) {
    const n = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([k, v]) => {
      if (v !== undefined && v !== null) n.setAttribute(k, v);
    });
    return n;
  }

  function hasDuplicate(selector, attr) {
    const val = selector.getAttribute(attr);
    if (!val) return false;
    return !!document.head.querySelector(`${selector.tagName.toLowerCase()}[${attr}="${CSS.escape(val)}"]`);
  }

  function appendNode(node) {
    if (node.tagName === 'SCRIPT') {
      // Undgå dubletter via src
      if (node.src && document.head.querySelector(`script[src="${CSS.escape(node.src)}"]`)) return;
      const s = el('script', {
        src: node.src || undefined,
        async: node.async ? '' : undefined,
        defer: node.defer ? '' : undefined,
        crossorigin: node.getAttribute('crossorigin') || undefined,
        type: node.type || undefined
      });
      // Bemærk: vi injicerer ikke inline JS (CSP)
      if (!s.src) return;
      document.head.appendChild(s);
      return;
    }

    if (node.tagName === 'LINK') {
      // Undgå dubletter via href
      if (hasDuplicate(node, 'href')) return;
      const l = el('link', {
        rel: node.rel || undefined,
        href: node.href || undefined,
        as: node.getAttribute('as') || undefined,
        type: node.type || undefined
      });
      document.head.appendChild(l);
      return;
    }

    if (node.tagName === 'META') {
      // Behold eksisterende side-specifikke metas; kun tilføj hvis unik (name|property)
      const name = node.getAttribute('name');
      const prop = node.getAttribute('property');
      if (name && document.head.querySelector(`meta[name="${CSS.escape(name)}"]`)) return;
      if (prop && document.head.querySelector(`meta[property="${CSS.escape(prop)}"]`)) return;
      document.head.appendChild(node.cloneNode(true));
      return;
    }

    // Fallback: tilføj rå kopi for andre tags
    document.head.appendChild(node.cloneNode(true));
  }

  fetch(PARTIAL_URL, { cache: 'no-store' })
    .then(res => {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.text();
    })
    .then(html => {
      const tmp = document.createElement('div');
      tmp.innerHTML = html;

      // Tilføj alle top-level nodes fra fragmentet
      Array.from(tmp.children).forEach(appendNode);
    })
    .catch(err => {
      // Stiltiende fejl—vi vil ikke knække siden, hvis partial ikke findes
      console.error('[include-header] Kunne ikke indlæse header:', err);
    });
})();
