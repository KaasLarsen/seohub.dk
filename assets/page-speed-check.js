(function () {
  const $ = (id) => document.getElementById(id);

  const $form   = $('speedForm');
  const $url    = $('url');
  const $status = $('status');
  const $statusWrap = $('statusWrap');
  const $results = $('results');
  const $summary = $('summary');
  const $head   = $('headChecks');
  const $sus    = $('suspects');
  const $raw    = $('raw');

  const proxyPrimary = (target) => 'https://api.allorigins.win/raw?url=' + encodeURIComponent(target);
  const proxyFallback = (target) => {
    const u = new URL(/^https?:\/\//i.test(target) ? target : ('https://' + target));
    return 'https://r.jina.ai/' + u.protocol + '//' + u.hostname + (u.port ? (':' + u.port) : '') + (u.pathname || '/') + (u.search || '');
  };

  function showStatus(msg) {
    $statusWrap.classList.remove('hidden');
    $status.textContent = msg;
  }
  function hideStatus(){ $statusWrap.classList.add('hidden'); }
  function showResults(){ $results.classList.remove('hidden'); }
  function clearResults(){
    $summary.innerHTML = '';
    $head.innerHTML = '';
    $sus.innerHTML = '';
    $raw.textContent = '';
    $results.classList.add('hidden');
  }
  function card(label, value) {
    const div = document.createElement('div');
    div.className = 'rounded-2xl border p-4 bg-white';
    div.innerHTML = '<div class="text-xs text-neutral-500 mb-1">'+label+'</div>'
                  + '<div class="text-xl font-semibold">'+value+'</div>';
    return div;
  }
  function li(text, ok = true) {
    const li = document.createElement('li');
    li.innerHTML = ok
      ? '<span class="text-green-700">'+text+'</span>'
      : '<span class="text-amber-700">'+text+'</span>';
    return li;
  }

  async function fetchHTML(target) {
    // 1) Prøv AllOrigins
    try {
      const t0 = performance.now();
      const res = await fetch(proxyPrimary(target), { cache: 'no-cache' });
      const t1 = performance.now();
      if (!res.ok) throw new Error('AllOrigins HTTP ' + res.status);
      const text = await res.text();
      return { text, ms: (t1 - t0) };
    } catch (e) {
      // 2) Fallback til r.jina.ai
      const t0 = performance.now();
      const res2 = await fetch(proxyFallback(target), { cache: 'no-cache' });
      const t1 = performance.now();
      if (!res2.ok) throw new Error('Fallback HTTP ' + res2.status);
      const text2 = await res2.text();
      return { text: text2, ms: (t1 - t0) };
    }
  }

  async function run(url) {
    clearResults();
    showStatus('Henter HTML via proxy…');

    let target = url.trim();
    if (!/^https?:\/\//i.test(target)) target = 'https://' + target;

    try {
      const { text: htmlText, ms } = await fetchHTML(target);

      const size = new Blob([htmlText]).size;
      const doc = new DOMParser().parseFromString(htmlText, 'text/html');

      const scripts = Array.from(doc.querySelectorAll('script[src]'));
      const styles  = Array.from(doc.querySelectorAll('link[rel="stylesheet"]'));
      const imgs    = Array.from(doc.querySelectorAll('img'));
      const hasViewport = !!doc.querySelector('meta[name="viewport"]');
      const hasCharset  = !!doc.querySelector('meta[charset]');
      const inlineStyles = Array.from(doc.querySelectorAll('style')).map(s => s.textContent || '').join('\n');
      const inlineSize = new Blob([inlineStyles]).size;

      const suspects = [];
      scripts.forEach(s => { const u=(s.getAttribute('src')||''); if (/\.(min\.)?js(\?|$)/i.test(u)) suspects.push(u); });
      styles.forEach(l => { const u=(l.getAttribute('href')||''); if (/\.css(\?|$)/i.test(u)) suspects.push(u); });
      imgs.forEach(i => { const u=(i.getAttribute('src')||''); if (/\.(png|jpg|jpeg|gif|webp|svg)(\?|$)/i.test(u)) suspects.push(u); });

      hideStatus(); showResults();
      $summary.appendChild(card('Proxy-downloadtid', (ms/1000).toFixed(2) + ' s'));
      $summary.appendChild(card('HTML-størrelse', (size/1024).toFixed(1) + ' KB'));
      $summary.appendChild(card('Scripts (eksterne)', scripts.length));
      $summary.appendChild(card('Billeder', imgs.length));
      $summary.appendChild(card('Stylesheets', styles.length));
      $summary.appendChild(card('Inline CSS', (inlineSize/1024).toFixed(1) + ' KB'));

      $head.appendChild(li(hasViewport ? 'Har <meta name="viewport">' : 'Mangler <meta name="viewport">', hasViewport));
      $head.appendChild(li(hasCharset  ? 'Har <meta charset>' : 'Mangler <meta charset>', hasCharset));

      if (suspects.length) {
        suspects.slice(0, 30).forEach(u => $sus.appendChild(li(u, true)));
        if (suspects.length > 30) $sus.appendChild(li('… +' + (suspects.length - 30) + ' flere', true));
      } else {
        $sus.appendChild(li('Ingen åbenlyse tunge filer fundet (heuristik).', true));
      }

      $raw.textContent = htmlText;

    } catch (err) {
      console.error(err);
      showStatus('Kunne ikke hente HTML: ' + (err.message || 'ukendt fejl') + '. Prøv en anden URL.');
    }
  }

  $form.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = $url.value || '';
    if (!v.trim()) return;
    run(v);
  });

  // Auto-run via ?url=
  const params = new URLSearchParams(location.search);
  if (params.has('url')) {
    const preset = params.get('url');
    $url.value = preset;
    run(preset);
  }
})();
