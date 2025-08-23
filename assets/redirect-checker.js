// /assets/redirect-checker.js
(function () {
  const $form   = document.getElementById("rc-form");
  const $input  = document.getElementById("rc-url");
  const $run    = document.getElementById("rc-run");
  const $clear  = document.getElementById("rc-clear");
  const $status = document.getElementById("rc-status");
  const $out    = document.getElementById("rc-results");

  function badge(status) {
    let cls = "bg-neutral-100 text-neutral-800";
    if (status >= 200 && status < 300) cls = "bg-green-100 text-green-800";
    else if (status >= 300 && status < 400) cls = "bg-amber-100 text-amber-800";
    else if (status >= 400) cls = "bg-red-100 text-red-800";
    return `<span class="inline-block px-2 py-0.5 rounded-full text-xs ${cls}">HTTP ${status}</span>`;
  }

  function row(label, value) {
    if (!value && value !== 0) return "";
    return `<div class="text-sm"><span class="text-neutral-500">${label}:</span> <span class="break-all">${value}</span></div>`;
  }

  function renderChain(steps = []) {
    if (!steps.length) {
      $out.innerHTML = `<div class="text-sm text-neutral-600">Ingen data.</div>`;
      return;
    }
    $out.innerHTML = steps.map((s, i) => {
      const head = `
        <div class="flex items-center justify-between mb-2">
          <div class="font-semibold">Hop ${i+1}</div>
          <div>${badge(s.status)}${s.timeMs != null ? ` <span class="text-xs text-neutral-500">(${s.timeMs} ms)</span>` : ""}</div>
        </div>
      `;
      const body = `
        ${row("URL", s.url)}
        ${row("Location", s.location)}
        ${row("Content-Type", s.contentType)}
      `;
      return `
        <div class="rounded-2xl border p-4 bg-white">
          ${head}
          ${body}
        </div>
      `;
    }).join("");
  }

  async function run(url) {
    $status.textContent = "Tjekker…";
    $out.innerHTML = "";
    try {
      const r = await fetch(`/api/redirect-chain?url=${encodeURIComponent(url)}`, { cache: "no-cache" });
      if (!r.ok) throw new Error(`Server fejl (${r.status})`);
      const data = await r.json();
      if (data.error) throw new Error(data.error);
      renderChain(data.steps || []);
      $status.textContent = data.finalUrl ? `Færdig → ${data.finalUrl}` : "Færdig";
    } catch (e) {
      console.error(e);
      $status.textContent = "Kunne ikke hente redirect-kæden.";
      $out.innerHTML = `<div class="text-sm text-red-600">Fejl: ${e.message || e}</div>`;
    }
  }

  $form.addEventListener("submit", (e) => {
    e.preventDefault();
    const url = $input.value.trim();
    if (!url) return;
    run(url);
  });

  $clear.addEventListener("click", () => {
    $input.value = "";
    $status.textContent = "";
    $out.innerHTML = "";
    $input.focus();
  });
})();
