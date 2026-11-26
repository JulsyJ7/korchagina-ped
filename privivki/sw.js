/* Памятка «Прививки» временно снята с сайта (27.11.2026, не согласована).
   Этот service worker заменяет прежний у тех, кто сохранял памятку: удаляет только её кэши (privivki-…),
   отключается и перезагружает открытые окна, чтобы вместо старой копии показалась заглушка. Чужие кэши не трогает. */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.split("-")[0] === "privivki").map((k) => caches.delete(k))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.matchAll({ type: "window" }))
      .then((wins) => Promise.all(wins.map((w) => w.navigate(w.url).catch(() => {}))))
  );
});
