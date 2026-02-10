/**
 * Service worker for Tagmall PWA.
 * Caches static assets and app shell; keeps API/data fresh for shopping flows.
 */

const CACHE_VERSION = "tagmall-v1";
const CACHE_STATIC = `${CACHE_VERSION}-static`;
const CACHE_RUNTIME = `${CACHE_VERSION}-runtime`;
const CACHE_IMAGES = `${CACHE_VERSION}-images`;
const MAX_IMAGE_ENTRIES = 80;
const IMAGE_FALLBACK_URL = "/assets/images/fallback/phone.png";

const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/offline.html",
  "/assets/fonts/style.css",
  "/assets/images/fallback/avatar.png",
  "/assets/images/fallback/phone.png",
  "/assets/images/logo/main-logo.svg",
];

// Install: cache critical static assets for offline shell
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches
      .open(CACHE_STATIC)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .catch(() => {}),
  );
});

// Activate: remove old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter(
              (key) =>
                key.startsWith("tagmall-") &&
                key !== CACHE_STATIC &&
                key !== CACHE_RUNTIME &&
                key !== CACHE_IMAGES,
            )
            .map((key) => caches.delete(key)),
        ),
      ),
  );
  self.clients.claim();
});

// Fetch: apply strategies by request type
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET") return;

  // Same-origin only (skip cross-origin API in sw to keep cart/orders fresh)
  if (url.origin !== self.location.origin) return;

  // Images: bounded cache + fallback on failure
  if (
    request.destination === "image" ||
    /\.(png|jpg|jpeg|gif|webp|svg|ico)(\?|$)/i.test(url.pathname)
  ) {
    event.respondWith(imageWithFallback(request));
    return;
  }

  // Static assets (fonts, manifest): cache-first; images handled above
  if (
    url.pathname.startsWith("/assets/") ||
    url.pathname === "/manifest.json"
  ) {
    event.respondWith(cacheFirst(request, CACHE_RUNTIME));
    return;
  }

  // Next.js static chunks: stale-while-revalidate for offline app
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(staleWhileRevalidate(request, CACHE_RUNTIME));
    return;
  }

  // Navigations (HTML): do not cache; offline = offline page only
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match("/offline.html").then(
          (r) =>
            r ||
            new Response(offlinePage(), {
              headers: { "Content-Type": "text/html; charset=utf-8" },
            }),
        ),
      ),
    );
    return;
  }

  // Other same-origin: network-first, no cache for fresh data
  event.respondWith(networkFirst(request, CACHE_RUNTIME));
});

function cacheFirst(request, cacheName) {
  return caches.open(cacheName).then((cache) =>
    cache.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((res) => {
          if (res && res.status === 200) cache.put(request, res.clone());
          return res;
        }),
    ),
  );
}

// Image: cache-first with bounded image cache; on failure return fallback image
function imageWithFallback(request) {
  return caches
    .open(CACHE_IMAGES)
    .then((cache) =>
      cache
        .match(request)
        .then((cached) => {
          if (cached) return cached;
          return fetch(request)
            .then((res) => {
              if (res && res.status === 200) {
                cache
                  .put(request, res.clone())
                  .then(() => trimCache(CACHE_IMAGES, MAX_IMAGE_ENTRIES));
                return res;
              }
              return fallbackImage();
            })
            .catch(() => fallbackImage());
        })
        .catch(() => fallbackImage()),
    )
    .catch(() => fallbackImage());
}

function fallbackImage() {
  return caches
    .match(IMAGE_FALLBACK_URL)
    .then((r) => r || fetch(IMAGE_FALLBACK_URL));
}

// Keep cache size under maxEntries by removing oldest (first keys)
function trimCache(cacheName, maxEntries) {
  return caches.open(cacheName).then((cache) =>
    cache.keys().then((keys) => {
      if (keys.length <= maxEntries) return;
      return Promise.all(
        keys.slice(0, keys.length - maxEntries).map((key) => cache.delete(key)),
      );
    }),
  );
}

function networkFirst(request, cacheName) {
  return fetch(request)
    .then((res) => {
      if (res && res.status === 200) {
        caches.open(cacheName).then((cache) => cache.put(request, res.clone()));
      }
      return res;
    })
    .catch(() => caches.open(cacheName).then((cache) => cache.match(request)));
}

function staleWhileRevalidate(request, cacheName) {
  return caches.open(cacheName).then((cache) =>
    cache.match(request).then((cached) => {
      const fetched = fetch(request).then((res) => {
        if (res && res.status === 200) cache.put(request, res.clone());
        return res;
      });
      return cached || fetched;
    }),
  );
}

function offlinePage() {
  return `
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>تگ مال - آفلاین</title>
  <style>
    body { font-family: system-ui, sans-serif; text-align: center; padding: 2rem; background: #f5f5f5; }
    h1 { color: #333; }
    p { color: #666; }
  </style>
</head>
<body>
  <h1>اتصال اینترنت برقرار نیست</h1>
  <p>صفحه را بعد از اتصال مجدد رفرش کنید.</p>
  <button onclick="window.location.reload()">تلاش مجدد</button>
</body>
</html>`;
}
