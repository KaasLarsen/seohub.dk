// /assets/consent-analytics.js
(function () {
  // ---- Simple cookie consent banner ----
  const KEY = "seohub-consent";
  const saved = localStorage.getItem(KEY);

  function accept() {
    localStorage.setItem(KEY, "yes");
    document.getElementById("cookie-banner")?.remove();
    initGA();
  }

  function decline() {
    localStorage.setItem(KEY, "no");
    document.getElementById("cookie-banner")?.remove();
  }

  function showBanner() {
    if (document.getElementById("cookie-banner")) return;
    const div = document.createElement("div");
    div.id = "cookie-banner";
    div.className =
      "fixed bottom-4 right-4 max-w-sm bg-white border shadow-lg p-4 rounded-xl text-sm z-50";
    div.innerHTML = `
      <p class="mb-3">Vi bruger cookies til statistik (Google Analytics).</p>
      <div class="flex gap-2">
        <button id="cookie-yes" class="px-3 py-1 rounded bg-blue-600 text-white">Accepter</button>
        <button id="cookie-no" class="px-3 py-1 rounded border">Afvis</button>
      </div>
    `;
    document.body.appendChild(div);
    document.getElementById("cookie-yes").onclick = accept;
    document.getElementById("cookie-no").onclick = decline;
  }

  // ---- Google Analytics init ----
  function initGA() {
    if (window.GA_INIT) return;
    window.GA_INIT = true;

    // indsæt GA4 script
    const s = document.createElement("script");
    s.src = "https://www.googletagmanager.com/gtag/js?id=G-2Z08EV6L9C";
    s.async = true;
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    window.gtag = gtag;

    gtag("js", new Date());
    gtag("config", "G-XXXXXXXXXX");
    console.info("GA init OK");

    // sikrer første page_view efter accept
    gtag("event", "page_view");
  }

  // ---- Consent check ----
  if (saved === "yes") {
    initGA();
  } else if (saved === "no") {
    // gør ingenting
  } else {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", showBanner);
    } else {
      showBanner();
    }
  }

  // --- Header re-loader (bevar v7, men bust cache på mobiler der hænger fast) ---
  try {
    var hasNav =
      !!document.getElementById("siteNav") ||
      !!document.querySelector("header .text-sm");
    if (!hasNav) {
      var existingTag = document.querySelector(
        'script[src*="/assets/include-header.js"]'
      );
      var srcBase = "/assets/include-header.js?v=7&cb=1";
      if (existingTag) {
        try {
          var url = new URL(existingTag.src);
          if (!url.searchParams.has("cb"))
            url.searchParams.set("cb", "1");
          srcBase =
            url.pathname + "?" + url.searchParams.toString();
        } catch (e) {}
      }
      var s2 = document.createElement("script");
      s2.src = srcBase;
      s2.defer = true;
      s2.onload = function () {
        console.info("Header v7 reloaded with cache-bust");
      };
      document.head.appendChild(s2);
    }
  } catch (e) {
    console.warn("Header reload shim failed:", e);
  }
})();
