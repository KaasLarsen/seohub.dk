/* =========================================================
   SEOHub – Consent + Analytics + Footer Autoload
   - Cookie banner (localStorage)
   - GA (G-FBXNYF72EJ) efter samtykke
   - Footer autoloader (/assets/include-footer.js)
   ========================================================= */

/* -------------------------
   Utils
------------------------- */
function seohubInjectScript(src, attrs = {}) {
  if (document.querySelector(`script[data-seohub="${src}"]`)) return; // avoid duplicates
  const s = document.createElement('script');
  s.src = src;
  s.defer = true;
  s.setAttribute('data-seohub', src);
  Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v));
  document.head.appendChild(s);
}

function seohubLoadGA(measurementId) {
  if (!measurementId) return;
  if (window.__seohubGA) return; // already loaded
  window.__seohubGA = true;

  // gtag loader
  const src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  seohubInjectScript(src, { async: '' });

  // init gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', measurementId, { anonymize_ip: true });
}

/* -------------------------
   Consent banner
------------------------- */
(function seohubConsent() {
  const KEY = 'seohub_consent_v1';
  const saved = (() => {
    try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; }
  })();

  // If already decided, act and exit
  if (saved && typeof saved === 'object') {
    if (saved.analytics === true) {
      seohubLoadGA('G-FBXNYF72EJ');
    }
    return;
  }

  // Styles (scoped)
  const style = document.createElement('style');
  style.textContent = `
  .sh-consent-wrap{position:fixed;inset:auto 0 0 0;z-index:9999;background:#0b1220;color:#fff}
  .sh-consent{max-width:1120px;margin:0 auto;padding:14px 16px;display:flex;gap:12px;align-items:center;flex-wrap:wrap}
  .sh-consent p{margin:0;font-size:14px;line-height:1.4;color:#dbe3ff}
  .sh-consent a{color:#9ec5ff;text-decoration:underline}
  .sh-consent .btns{margin-left:auto;display:flex;gap:8px}
  .sh-btn{appearance:none;border:1px solid #2a3354;background:#131b2f;color:#fff;border-radius:10px;padding:8px 12px;font-size:14px;cursor:pointer}
  .sh-btn.primary{background:#2563eb;border-color:#2563eb}
  .sh-btn:hover{filter:brightness(1.05)}
  @media (max-width:640px){.sh-consent .btns{margin-left:0;width:100%;justify-content:flex-start}}
  `;
  document.head.appendChild(style);

  // Banner DOM
  const wrap = document.createElement('div');
  wrap.className = 'sh-consent-wrap';
  wrap.innerHTML = `
    <div class="sh-consent">
      <p>
        Vi bruger cookies til statistik (Google Analytics) for at forbedre SEOHub. 
        Læs mere i <a href="/privatliv-cookies.html">Privatliv & cookies</a>.
      </p>
      <div class="btns">
        <button class="sh-btn" data-action="deny">Afvis</button>
        <button class="sh-btn primary" data-action="allow">Accepter</button>
      </div>
    </div>
  `;
  document.body.appendChild(wrap);

  const decide = (allow) => {
    const value = { analytics: !!allow, time: Date.now() };
    try { localStorage.setItem(KEY, JSON.stringify(value)); } catch {}
    wrap.remove();
    if (allow) {
      seohubLoadGA('G-FBXNYF72EJ');
    }
  };

  wrap.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    if (btn.dataset.action === 'allow') decide(true);
    if (btn.dataset.action === 'deny') decide(false);
  });
})();

/* -------------------------
   Footer autoloader
------------------------- */
(function loadFooterOnce() {
  if (window.__footerLoaded) return;
  window.__footerLoaded = true;

  // Load /assets/include-footer.js which mounts a footer into #footer (or appends one)
  seohubInjectScript('/assets/include-footer.js');
})();
