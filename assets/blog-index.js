// /assets/blog-index.js (v3 PRODUCTION) — loader /blog/posts.json og renderer kort
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
      setStatus(`<span class="text-red-600">Ingen indlæg fundet.</span>`);
      return;
    }
    posts.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    listEl.innerHTML = posts.map(cardTemplate).join("");
    hideStatus();
  }

  async function init() {
    if (!listEl || !statusEl) return;
    try {
      const url = `/blog/posts.json?v=${Date.now()}`; // cache-bust
      const res = await fetch(url, { cache: "no-store", credentials: "same-origin" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const json = await res.json();
      renderPosts(json);
    } catch (e) {
      setStatus(`<div class="text-red-600">Kunne ikke hente indlæg.</div>`);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
