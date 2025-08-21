// /assets/blog-index-debug.js
(function() {
  console.log("[blog-debug] starting debug script");

  const log = (...args) => console.log("[blog-debug]", ...args);
  const err = (...args) => console.error("[blog-debug]", ...args);

  // 1) Test, at JS loader
  log("JS is loaded successfully.");

  // 2) Test fetching posts.json
  fetch("/blog/posts.json")
    .then(r => {
      log("fetch status:", r.status, r.statusText);
      return r.text();
    })
    .then(text => {
      log("fetch text (first 200 chars):", text.slice(0,200));
      try {
        const json = JSON.parse(text);
        log("JSON parsed—number of entries:", Array.isArray(json)?json.length:"not an array");
      } catch(e) {
        err("JSON parse error:", e.message);
      }
    })
    .catch(e => {
      err("fetch error:", e.message);
    });

})();
