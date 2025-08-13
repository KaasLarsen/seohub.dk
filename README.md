# Seohub (statisk version)

Dette er en statisk udgave af Seohub (ingen build, ingen backend). Den kører med React og Tailwind via CDN.

## Hurtig deploy (Vercel)
1. Opret et tomt privat repository på GitHub.
2. Upload filerne i denne mappe (index.html, app.js, robots.txt, sitemap.xml, favicon.svg, og evt. billeder) via GitHubs webinterface.
3. Gå til Vercel → New Project → Import Git Repository → vælg repo → Deploy.
4. Tilføj domæne `seohub.dk` i Project → Settings → Domains.
5. Peg DNS hos One.com:
   - **A record** for root/apex (`seohub.dk`) → `76.76.21.21`
   - **CNAME record** for `www` → `cname.vercel-dns.com`
6. Vent 30–60 min på DNS, så vil `https://seohub.dk` vise siden.

## Tilpasning
- Opdater titler og beskrivelser i `index.html`.
- Opdater standard URL i appen i `app.js` (fx i SERP-preview).
