// /assets/serp-preview-page.js
(function () {
  const $t = document.getElementById("titleInput");
  const $u = document.getElementById("urlInput");
  const $d = document.getElementById("descInput");

  const $pt = document.getElementById("previewTitle");
  const $pu = document.getElementById("previewUrl");
  const $pd = document.getElementById("previewDesc");

  const $tb = document.getElementById("titleBadge");
  const $db = document.getElementById("descBadge");

  const $ct = document.getElementById("copyTitle");
  const $cd = document.getElementById("copyDesc");

  function setBadge($el, label, n, okMin, okMax) {
    const ok = n >= okMin && n <= okMax;
    $el.textContent = `${label}: ${n} tegn`;
    $el.className = `px-2 py-1 rounded-full ${ok ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`;
  }

  function update() {
    const t = ($t.value || "").trim();
    const u = ($u.value || "").trim();
    const d = ($d.value || "").trim();

    $pt.textContent = t || "Din titel vises her";
    $pu.textContent = u || "https://www.seohub.dk/";
    $pd.textContent = d || "Skriv en præcis metabeskrivelse, der matcher søgeintentionen og inkluderer primært søgeord + USP.";

    setBadge($tb, "titel", t.length, 50, 60);
    setBadge($db, "meta", d.length, 140, 160);
  }

  $t.addEventListener("input", update);
  $u.addEventListener("input", update);
  $d.addEventListener("input", update);

  $ct.addEventListener("click", () => {
    navigator.clipboard.writeText(($t.value || "").trim()).catch(()=>{});
  });
  $cd.addEventListener("click", () => {
    navigator.clipboard.writeText(($d.value || "").trim()).catch(()=>{});
  });

  // Init
  update();
})();
