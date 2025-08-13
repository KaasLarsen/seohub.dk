/* /assets/consent-analytics.js
   - Viser et simpelt dansk cookie-banner
   - Gemmer samtykke i localStorage
   - Loader GA4 først når der er givet samtykke
*/
(function () {
  var GA_ID = "G-FBXNYF72EJ"; // ← dit GA4 måle-ID

  // --- stil til banneret (inline for at undgå ekstra CSS) ---
  var css = "" +
    "#cookie-banner{position:fixed;inset:auto 0 0 0;z-index:9999;background:#111827;color:#fff;padding:14px 16px;display:flex;gap:12px;align-items:center;flex-wrap:wrap}" +
    "#cookie-banner p{margin:0;font-size:14px;line-height:1.4}" +
    "#cookie-banner a{color:#93c5fd;text-decoration:underline}" +
    "#cookie-banner .btn{border:1px solid #374151;padding:8px 12px;border-radius:10px;background:#1f2937;color:#fff;font-size:14px;cursor:pointer}" +
    "#cookie-banner .btn.accept{background:#16a34a;border-color:#16a34a}" +
    "#cookie-banner .btn.reject{background:#374151}" +
    "@media(min-width:640px){#cookie-banner{justify-content:space-between}}" ;

  function injectStyle() {
    var s = document.createElement("style");
    s.textContent = css;
    document.head.appendChild(s);
  }

  function hasConsent() {
    return localStorage.getItem("cookie_consent") === "accepted";
  }
  function denied() {
    return localStorage.getItem("cookie_consent") === "rejected";
  }
  function setConsent(v) {
    localStorage.setItem("cookie_consent", v);
  }

  function loadGA() {
    if (!GA_ID) return; // stop hvis ikke sat
    // gtag loader
    var s1 = document.createElement("script");
    s1.async = true;
    s1.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(s1);

    var s2 = document.createElement("script");
    s2.text = [
      "window.dataLayer = window.dataLayer || [];",
      "function gtag(){dataLayer.push(arguments);}",
      "gtag('js', new Date());",
      "gtag('config', '" + GA_ID + "', { anonymize_ip: true });"
    ].join("\n");
    document.head.appendChild(s2);
  }

  function showBanner() {
    if (document.getElementById("cookie-banner")) return;
    injectStyle();
    var bar = document.createElement("div");
    bar.id = "cookie-banner";
    bar.innerHTML =
      '<p>Vi bruger cookies til <strong>statistik</strong> (Google Analytics), hvis du accepterer. ' +
      'Læs mere på vores <a href="/privatliv-cookies.html">Privatliv & cookies</a>.</p>' +
      '<div style="margin-left:auto;display:flex;gap:8px">' +
      '<button class="btn reject" type="button">Afvis</button>' +
      '<button class="btn accept" type="button">Accepter</button>' +
      "</div>";
    document.body.appendChild(bar);

    bar.querySelector(".accept").addEventListener("click", function () {
      setConsent("accepted");
      bar.remove();
      loadGA();
    });
    bar.querySelector(".reject").addEventListener("click", function () {
      setConsent("rejected");
      bar.remove();
    });
  }

  // Init
  if (hasConsent()) {
    loadGA();
  } else if (!denied()) {
    // Vis banneret kun hvis der ikke er taget stilling
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", showBanner);
    } else {
      showBanner();
    }
  }
})();
