// Henter /blog/posts.json og renderer kort på /blog/ (ekstern pga. CSP)
(function () {
  function $(id) { return document.getElementById(id); }

  const listEl = $("postsList");
  const statusEl = $("statusBox");

  function setStatus(html) {
    if (!statusEl) return;
    statusEl.innerHTML = html;
    statusEl.classList.remove("hidden");
  }
  function hideStatus() {
    if (!statusEl) return;
    statusEl.classList.add("hidden");
  }

  function cardTemplate(p) {
    const href = `/blog/${p.slug}.html`;
    const tags = (p.tags || [])
      .map(t => `<span class="px-2 py-1 rounded-full text-xs bg-neutral-100">${t}</span>`)
      .join(" ");
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
      setStatus(`<span class="text-red-600">Ingen indlæg fundet.</span>
        <span class="text-neutral-500">Tjek at <code>/public/blog/posts.json</code> findes, og at filen er gyldig JSON.</span>`);
      return;
    }
    // sortér nyeste først (forudsætter YYYY-MM-DD)
    posts.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    listEl.innerHTML = posts.map(cardTemplate).join("");
    hideStatus();
  }

  function init() {
    try {
      const url = `/blog/posts.json?v=${Date.now()}`; // cache-bust
      console.log("[Blog] Fetch:", url);
      fetch(url, { cache: "no-store", credentials: "same-origin" })
        .then(r => {
          console.log("[Blog] HTTP", r.status);
          if (!r.ok) throw new Error("HTTP " + r.status);
          return r.json();
        })
        .then(json => {
          console.log("[Blog] JSON", json);
          if (!Array.isArray(json)) throw new Error("posts.json skal være en liste []");
          const invalid = json.find(p => !p || typeof p.slug !== "string");
          if (invalid) throw new Error("Ugyldigt objekt i posts.json (mangler slug som string).");
          renderPosts(json);
        })
        .catch(err => {
          console.error("[Blog] Fejl:", err);
          setStatus(`
            <div class="text-red-600">Kunne ikke hente indlæg.</div>
            <div class="text-neutral-500 mt-1">
              Tjek at <code>/public/blog/posts.json</code> findes, er gyldig JSON, og at dine .html-filer ligger i <code>/public/blog/</code>.
            </div>
          `);
        });
    } catch (e) {
      console.error("[Blog] Fatal:", e);
      setStatus(`<span class="text-red-600">Uventet fejl i blog-index.</span>`);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
