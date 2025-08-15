// /assets/consent-analytics.js
// GA4 indlæsning med let Consent Mode. Kræver at dit cookiebanner skriver localStorage
// og/eller udsender eventet 'seohub:consent-update' med { analytics: true } når brugeren accepterer.

(function () {
  var GA_ID = 'G-FBXNYF72EJ';
  var CONSENT_KEY = 'seohub_consent'; // forventer et JSON-objekt i localStorage, fx {"analytics":true}

  function hasAnalyticsConsent() {
    try {
      var raw = localStorage.getItem(CONSENT_KEY);
      if (!raw) return false;
      var obj = JSON.parse(raw);
      return !!(obj.analytics === true || obj.all === true);
    } catch (e) {
      return false;
    }
  }

  function loadGA() {
    if (window.__seohubGALoaded) return;
    window.__seohubGALoaded = true;

    // Hent gtag.js
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);

    // Init gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    window.gtag = gtag;

    // Consent Mode (grant analytics)
    gtag('consent', 'default', { analytics_storage: 'granted' });

    // Standard init + config
    gtag('js', new Date());
    gtag('config', GA_ID, {
      anonymize_ip: true,
      send_page_view: true,
      transport_type: 'beacon'
    });
  }

  // 1) Indlæs straks, hvis der allerede er givet samtykke
  if (hasAnalyticsConsent()) {
    loadGA();
  }

  // 2) Lyt efter opdatering fra dit cookiebanner
  window.addEventListener('seohub:consent-update', function (e) {
    if (e && e.detail && e.detail.analytics === true) {
      try {
        // Persister analytics=true hvis banneret ikke allerede gør
        var raw = localStorage.getItem(CONSENT_KEY) || '{}';
        var obj = {};
        try { obj = JSON.parse(raw); } catch(_) {}
        obj.analytics = true;
        localStorage.setItem(CONSENT_KEY, JSON.stringify(obj));
      } catch (_) {}
      loadGA();
    }
  });
})();
