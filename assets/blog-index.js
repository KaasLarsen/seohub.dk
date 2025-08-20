// /assets/blog-index.js (v4 — robust fejlvisning)
(function () {
  function $(id) { return document.getElementById(id); }
  const listEl   = $("postsList");
  const statusEl = $("statusBox");

  function setStatus(html) {
    if (!statusEl) return;
    statusEl.innerHTML = html;
    statusEl.classList.remove("hidden");
  }
  function hideStatus() { statusEl && statusEl.classList.add("hidden"); }

  function cardTemplate(p) {
    const href = `/blog/${p.slug}.html`;
    const tags = (p.tags || []).map(t => `<span class="px-2 py-1 rounded-full text-xs bg-neutral-100">${t}</span>`).join(" ");
    return `
      <a href="${href}" class="block rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition">
        <div class="text-xs text-neutral-500 mb-1">${p.date || ""}</div>
        <h2 class="text-lg font-semibold leading-snug mb-2">${p.title}</h2>
        <p class="text-sm text-neutral-600 mb-3">${p.excerpt || ""}</p>
        <div class="flex flex-wrap gap-2">${tags}</div>
      </a>
    `;
  }

  function renderPosts(posts) {
    if (!Array.isArray(posts) || posts.length === 0) {
      setStatus(`<span class="text-red-600">Ingen indlæg fundet i posts.json.</span>`);
      return;
    }
    posts.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    listEl.innerHTML = posts.map(cardTemplate).join("");
    hideStatus();
  }

  async function fetchJson(url) {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch (e) {
      throw new Error(`JSON parse fejl for ${url}: ${e.message}`);
    }
  }

  async function init() {
    if (!listEl || !statusEl) return;

    // Primær sti
    const url1 = `/blog/posts.json?v=${Date.now()}`;
    // Fallback (hvis nogen har lagt den et forkert sted)
    const url2 = `/posts.json?v=${Date.now()}`;

    try {
      let data;
      try {
        data = await fetchJson(url1);
      } catch (e1) {
        console.warn("[Blog] Primær failede:", e1.message);
        try {
          data = await fetchJson(url2);
        } catch (e2) {
          setStatus(`
            <div class="text-red-600 font-semibold mb-1">Kunne ikke hente indlæg.</div>
            <div class="text-neutral-700 text-sm">
              Fejl:
              <div class="mt-1 p-2 rounded bg-neutral-50 border"><code>${e1.message}</code></div>
              <div class="mt-1 p-2 rounded bg-neutral-50 border"><code>${e2.message}</code></div>
            </div>
            <div class="text-neutral-500 text-xs mt-2">
              Løsning: Sørg for at <code>/blog/posts.json</code> findes i public-mappen og er gyldig JSON (uden kommentarer/trailing komma).
            </div>
          `);
          return;
        }
      }
      renderPosts(data);
    } catch (e) {
      setStatus(`<div class="text-red-600">Uventet fejl: ${e.message}</div>`);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
