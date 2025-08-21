// /assets/blog-index.js v2 — robust blogindex m. logs
(function () {
  const LOG = (...a) => console.log("[blog-index]", ...a);
  const ERR = (...a) => console.error("[blog-index]", ...a);

  const FEATURED = [
    "seo-for-begyndere-2025",
    "intern-linkbuilding-strategi",
    "core-web-vitals-2025"
  ];

  let ALL = [];
  let TAGS = [];
  let query = "";
  let activeTag = "alle";

  // Grab elements (MÅ MATCHE index.html)
  const $q            = document.getElementById("q");
  const $clear        = document.getElementById("clearBtn");
  const $chips        = document.getElementById("tagChips");
  const $list         = document.getElementById("list");
  const $count        = document.getElementById("count");
  const $empty        = document.getElementById("empty");
  const $fatal        = document.getElementById("fatal");
  const $featuredWrap = document.getElementById("featuredWrap");
  const $featuredGrid = document.getElementById("featuredGrid");

  function esc(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}

  async function loadPosts() {
    const ts = Date.now();
    const tryUrls = [
      "/blog/posts.json?ts="+ts,     // korrekt placering (anbefalet)
      "posts.json?ts="+ts,           // relativ fallback (hvis hostet i /blog/)
      "/posts.json?ts="+ts           // root fallback (hvis nogen har lagt den i roden)
    ];
    let lastErr = null;
    for (const url of tryUrls) {
      try {
        LOG("fetch", url);
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status} @ ${url}`);
        let txt = await res.text();
        if (txt.trim().startsWith("<")) throw new Error(`Modtog HTML (ikke JSON) @ ${url}`);
        txt = txt.replace(/^\uFEFF/, ""); // fjern BOM
        const data = JSON.parse(txt);
        if (!Array.isArray(data)) throw new Error(`JSON er ikke array @ ${url}`);
        LOG("OK fra", url, `(${data.length} indlæg)`);
        return data;
      } catch (e) { lastErr = e; ERR(e.message); }
    }
    throw lastErr || new Error("Kunne ikke indlæse posts.json fra nogen kendt placering.");
  }

  function buildTags() {
    const freq = new Map();
    ALL.forEach(p => {
      (Array.isArray(p.tags)?p.tags:[]).forEach(t=>{
        const k = String(t||"").trim().toLowerCase();
        if (!k) return;
        freq.set(k,(freq.get(k)||0)+1);
      });
    });
    TAGS = Array.from(freq.keys()).sort((a,b)=>a.localeCompare(b));

    $chips.innerHTML = "";
    const add = (label,val)=>{
      const btn = document.createElement("button");
      btn.type="button";
      btn.className="chip text-sm";
      btn.textContent=label;
      btn.dataset.value=val;
      if (val===activeTag) btn.classList.add("chip-active");
      btn.addEventListener("click", ()=>{
        activeTag = val;
        $chips.querySelectorAll("button").forEach(b=>b.classList.remove("chip-active"));
        btn.classList.add("chip-active");
        render();
      });
      $chips.appendChild(btn);
    };
    add("Alle","alle");
    TAGS.forEach(t=>add(t,t));
    LOG("tags", TAGS);
  }

  function applyFilters(list){
    let out=list;
    if (activeTag!=="alle"){
      out = out.filter(p => Array.isArray(p.tags) && p.tags.map(String).map(x=>x.toLowerCase()).includes(activeTag));
    }
    if (query){
      const q = query.toLowerCase();
      out = out.filter(p =>
        (p.title||"").toLowerCase().includes(q) ||
        (p.excerpt||"").toLowerCase().includes(q) ||
        (Array.isArray(p.tags) && p.tags.some(t => String(t).toLowerCase().includes(q)))
      );
    }
    return out;
  }

  function CardHTML(p, featured=false){
    const tags = (Array.isArray(p.tags)?p.tags:[]).slice(0,4);
    return `
      <a href="/blog/${p.slug}.html" class="block rounded-2xl border bg-white p-5 hover:shadow transition">
        ${featured?'<div class="text-[11px] uppercase tracking-wide text-blue-700 mb-2">Udvalgt</div>':''}
        <div class="font-semibold">${esc(p.title||"Uden titel")}</div>
        ${p.excerpt?`<div class="text-sm text-neutral-600 mt-1">${esc(p.excerpt)}</div>`:""}
        <div class="mt-3 flex items-center justify-between text-xs text-neutral-500">
          <span>${p.date?esc(p.date):""}</span>
          <span class="flex gap-2">${tags.map(t=>`<span class="px-2 py-1 rounded-full bg-neutral-100">${esc(String(t))}</span>`).join("")}</span>
        </div>
      </a>
    `;
  }

  function renderFeatured(){
    const items = ALL.filter(p=>FEATURED.includes(p.slug));
    if (!items.length){ $featuredWrap.classList.add("hidden"); return; }
    $featuredWrap.classList.remove("hidden");
    $featuredGrid.innerHTML = items.map(p=>CardHTML(p,true)).join("");
  }

  function render(){
    const filtered = applyFilters(ALL);
    $count.textContent = filtered.length ? `${filtered.length} indlæg` : "";
    $empty.classList.toggle("hidden", filtered.length>0);
    $list.innerHTML = filtered.map(p=>CardHTML(p,false)).join("");
    LOG("render", {q:query, tag:activeTag, count:filtered.length});
  }

  // UI events
  if ($q) {
    $q.addEventListener("input", ()=>{
      query = $q.value.trim();
      if ($clear) $clear.classList.toggle("hidden", query.length===0);
      render();
    });
  }
  if ($clear) {
    $clear.addEventListener("click", ()=>{
      $q.value=""; query=""; $clear.classList.add("hidden"); render();
    });
  }

  // Init
  document.addEventListener("DOMContentLoaded", () => {
    LOG("DOMContentLoaded");
    loadPosts()
      .then(data=>{
        ALL = data.slice().sort((a,b)=> String(b.date||"").localeCompare(String(a.date||"")));
        LOG("posts loaded", ALL.length);
        buildTags();
        renderFeatured();
        render();
      })
      .catch(err=>{
        ERR(err);
        if ($fatal) $fatal.classList.remove("hidden");
      });
  });
})();
