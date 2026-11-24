/* Офлайн-кэш главной страницы. Версия меняется при каждом обновлении index.html. */
const VERSION = "home-2f36ccd347";
const CORE = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png", "./favicon-32.png", "./photo.jpg", "./pattern-light.webp", "./pattern-dark.webp", "./thumb-malysh.webp", "./thumb-prikorm.webp", "./thumb-privivki.webp", "./thumb-lihoradka.webp", "./thumb-aptechka.webp", "./font-lora-cyrillic-700.woff2", "./font-lora-latin-700.woff2", "./font-manrope-cyrillic-400.woff2", "./font-manrope-cyrillic-700.woff2", "./font-manrope-cyrillic-800.woff2", "./font-manrope-latin-400.woff2", "./font-manrope-latin-700.woff2", "./font-manrope-latin-800.woff2"];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION && /^(home|aptechka)-/.test(k)).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const base = new URL("./", self.registration.scope).pathname;
  const rest = url.pathname.slice(base.length);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(base) || rest.includes("/")) return;
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).then((res) => { const copy = res.clone(); caches.open(VERSION).then((c) => c.put("./index.html", copy)); return res; })
      .catch(() => caches.match("./index.html")));
    return;
  }
  e.respondWith(caches.open(VERSION).then((c) => c.match(req).then((hit) => {
    const net = fetch(req).then((res) => { if (res && res.ok) c.put(req, res.clone()); return res; }).catch(() => hit);
    return hit || net;
  })));
});
