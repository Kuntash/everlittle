const CACHE = "everlittle-static-v3";
const SHELL = [
  "/offline",
  "/manifest.webmanifest",
  "/icon.svg",
  "/icon-192.png",
  "/icon-512.png",
  "/icon-maskable-512.png",
  "/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)));
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith("/api/")) return;

  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request).catch(() => caches.match("/offline")));
    return;
  }

  const cacheable =
    url.pathname.startsWith("/assets/") ||
    url.pathname.startsWith("/memory-types/") ||
    SHELL.includes(url.pathname);
  if (!cacheable) return;

  event.respondWith(
    caches.match(event.request).then(
      (cached) =>
        cached ??
        fetch(event.request).then((response) => {
          if (response.ok && response.type === "basic") {
            const copy = response.clone();
            event.waitUntil(caches.open(CACHE).then((cache) => cache.put(event.request, copy)));
          }
          return response;
        }),
    ),
  );
});
