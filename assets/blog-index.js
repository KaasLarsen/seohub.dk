// /assets/blog-index.js — loader posts.json, styrer søgning, fallback m.m.
(function(){
  const $list   = document.getElementById("list");
  const $count  = document.getElementById("count");
  const $fatal  = document.getElementById("fatal");
  const $q      = document.getElementById("searchInput");
  const $clear  = document.getElementById("searchClear");
  const $seed   = document.getElementById("fallback-list");

  let ALL = [];   // alle posts (fra posts.json eller fallback)
  let query = "";

  const esc = s => String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));

  function renderList(arr){
    if (!arr.length) {
      $list.innerHTML = '<p class="text-sm text-neutral-600">Ingen indlæg matcher søgningen.</p>';
      return;
    }
    $list.innerHTML = arr.map(p => {
      const tags = Array.isArray(p.tags) ? p.tags.slice(0,6).map(t => `
        <button data-tag="${esc(String(t))}"
                class="text-xs px-2 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200">${esc(String(t))}</button>`).join(" ") : "";
      return `
        <a href="/blog/${esc(p.slug)}.html"
           class="block rounded-2xl border bg-white p-5 hover:shadow transition">
          <div class="font-semibold">${esc(p.title||"Uden titel")}</div>
          ${p.excerpt ? `<div class="text-sm text-neutral-600 mt-1">${esc(p.excerpt)}</div>` : ""}
          <div class="mt-3 flex items-center justify-between">
            <div class="text-xs text-neutral-500">${p.date ? esc(p.date) : ""}</div>
            ${tags ? `<div class="flex flex-wrap gap-2">${tags}</div>` : ""}
          </div>
        </a>`;
    }).join("");

    // tag klik => filter
    $list.querySelectorAll('button[data-tag]').forEach(btn=>{
      btn.addEventListener('click', (e)=>{
        e.preventDefault();
        const t = btn.getAttribute('data-tag') || "";
        query = t;
        $q.value = t;
        $clear.classList.toggle('hidden', !query.trim());
        performSearch();
      });
    });
  }

  function performSearch(){
    const q = query.trim().toLowerCase();
    const arr = !q ? ALL : ALL.filter(p=>{
      const txt = `${p.title||""} ${p.excerpt||""} ${(p.tags||[]).join(" ")}`.toLowerCase();
      return txt.includes(q);
    });
    $count.textContent = `${ALL.length} indlæg${q ? ` · ${arr.length} match` : ""}`;
    renderList(arr);
  }

  function buildFromFallback(){
    const items = Array.from($seed.querySelectorAll('a[href]')).map(a => {
      const href = a.getAttribute('href') || "";
      const slug = (href.split('/').pop() || "").replace(/\.html$/i, "");
      const title = a.getAttribute('data-title') || a.textContent.trim() || slug;
      const excerpt = a.getAttribute('data-excerpt') || "";
      const date = a.getAttribute('data-date') || "";
      const tags = (a.getAttribute('data-tags') || "").split(',').map(s=>s.trim()).filter(Boolean);
      return { slug, title, excerpt, date, tags };
    });
    ALL = items.sort((a,b)=> String(b.date||"").localeCompare(String(a.date||"")));
  }

  // events for søg
  if ($q) {
    $q.addEventListener('input', ()=>{
      query = $q.value;
      $clear.classList.toggle('hidden', !query.trim());
      performSearch();
    });
  }
  if ($clear) {
    $clear.addEventListener('click', ()=>{
      $q.value = ""; query = "";
      $clear.classList.add('hidden');
      performSearch();
    });
  }

  // 1) Prøv at hente posts.json
  const url = `/blog/posts.json?v=${Date.now()}`;
  fetch(url, { cache: "no-store" })
    .then(r => { if(!r.ok) throw new Error("HTTP "+r.status); return r.text(); })
    .then(txt => {
      if (!txt || txt.trim().startsWith("<")) throw new Error("Fik HTML (ikke JSON)");
      const data = JSON.parse(txt);
      if (!Array.isArray(data)) throw new Error("JSON er ikke et array");
      ALL = data.slice().sort((a,b)=> String(b.date||"").localeCompare(String(a.date||"")));
      $fatal.classList.add('hidden');
      performSearch();
    })
    .catch(err => {
      console.warn("[blog] posts.json fejl:", err && err.message ? err.message : err);
      // 2) Fald tilbage: byg liste ud fra fallback-“seed”
      buildFromFallback();
      $fatal.classList.remove('hidden');
      performSearch();
    });
})();
