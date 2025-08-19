// /assets/consent-analytics.js — Consent + Google Analytics 4 (patched)

// Dit GA4 Measurement ID
const GA_MEASUREMENT_ID = "G-FBXNYF72EJ";

(function () {
  let gaLoaded = false;

  // Indsæt GA-scriptet
  function loadGA() {
    if (gaLoaded) return;
    gaLoaded = true;

    // Opret script tag
    const gtagScript = document.createElement("script");
    gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    gtagScript.async = true;
    document.head.appendChild(gtagScript);

    // Init dataLayer + gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;

    gtag("js", new Date());
    gtag("config", GA_MEASUREMENT_ID);

    console.log("[ConsentAnalytics] GA init OK");

    // Send første page_view manuelt (efter samtykke)
    gtag("event", "page_view", {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname
    });
    console.log("[ConsentAnalytics] Første page_view sendt");
  }

  // --- Cookie Consent Banner ---
  function showBanner() {
    if (localStorage.getItem("cookie_consent") === "accepted") {
      loadGA();
      return; // Ingen banner, GA starter direkte
    }

    const banner = document.createElement("div");
    banner.id = "cookie-banner";
    banner.className =
      "fixed bottom-0 left-0 right-0 bg-neutral-900 text-white text-sm p-4 flex flex-col md:flex-row items-center justify-between z-50";
    banner.innerHTML = `
      <p class="mb-2 md:mb-0">Vi bruger cookies til statistik (Google Analytics). </p>
      <div class="flex gap-2">
        <button id="cookie-accept" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">Accepter</button>
        <button id="cookie-decline" class="bg-neutral-600 hover:bg-neutral-700 text-white px-3 py-1 rounded">Afvis</button>
      </div>
    `;
    document.body.appendChild(banner);

    document.getElementById("cookie-accept").addEventListener("click", () => {
      localStorage.setItem("cookie_consent", "accepted");
      banner.remove();
      loadGA(); // Init GA + send første page_view
    });

    document.getElementById("cookie-decline").addEventListener("click", () => {
      localStorage.setItem("cookie_consent", "declined");
      banner.remove();
      console.log("[ConsentAnalytics] Bruger afviste cookies");
    });
  }

  // --- Init ---
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", showBanner);
  } else {
    showBanner();
  }
})();
