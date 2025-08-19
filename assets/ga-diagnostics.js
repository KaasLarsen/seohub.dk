// /assets/ga-diagnostics.js (midlertidig debug)
(function () {
  const MEASUREMENT_ID = 'G-FBXNYF72EJ';

  // Vent til consent-analytics har initieret gtag (eller 2 sek fallback)
  function whenGtagReady(cb) {
    let tries = 0;
    const iv = setInterval(() => {
      tries++;
      if (typeof window.gtag === 'function') {
        clearInterval(iv);
        cb();
      } else if (tries > 20) { // ~2s
        clearInterval(iv);
        console.warn('gtag ikke klar – sender direkte init (debug).');
        // Nødfyr gtag ind hvis ikke indlæst
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});})(window,document,'script','dataLayer',MEASUREMENT_ID);
      }
    }, 100);
  }

  function sendTest() {
    try {
      // Debug view flag
      window.gtag('consent', 'update', {
        'analytics_storage': 'granted',
        'ad_storage': 'denied',
        'functionality_storage': 'granted',
        'security_storage': 'granted'
      });
      // Page_view med debug_mode
      window.gtag('event', 'page_view', {
        page_title: document.title,
        page_location: location.href,
        page_path: location.pathname,
        debug_mode: true
      });
      // Ekstra test-event
      window.gtag('event', 'sh_test_ping', {
        label: 'manual-ping',
        debug_mode: true
      });
      console.log('[GA Debug] page_view + sh_test_ping sendt.');
    } catch (e) {
      console.warn('GA debug fejl:', e);
    }
  }

  whenGtagReady(sendTest);
})();
