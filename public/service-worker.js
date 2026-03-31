/* Simple PWA service worker with offline fallback */
const CACHE_NAME = 'gp-cache-v1';
// Use relative paths so this works under GitHub Pages subpath
const BASE = self.registration.scope.replace(/\/$/, '');
const OFFLINE_URL = `${BASE}/offline.html`;

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll([
      OFFLINE_URL,
      `${BASE}/favicon.ico`,
      `${BASE}/logo192.png`,
      `${BASE}/logo512.png`,
      `${BASE}/manifest.json`
    ]);
  })());
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // Enable navigation preload for faster navigations if supported
    if (self.registration.navigationPreload) {
      await self.registration.navigationPreload.enable();
    }

    // Clean up old caches
    const keys = await caches.keys();
    await Promise.all(
      keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : Promise.resolve()))
    );

    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Handle navigations: network first, fallback to offline page
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        // Use preloaded response if available
        const preloaded = await event.preloadResponse;
        if (preloaded) return preloaded;

        const networkResponse = await fetch(request);
        return networkResponse;
      } catch (err) {
        const cache = await caches.open(CACHE_NAME);
        const offlineResponse = await cache.match(OFFLINE_URL);
        return offlineResponse;
      }
    })());
    return;
  }

  // Cache-first for same-origin static assets
  const url = new URL(request.url);
  const isStatic = /\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|woff2?|ttf)$/i.test(url.pathname);
  if (url.origin === self.location.origin && isStatic) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(request);
      if (cached) return cached;
      try {
        const response = await fetch(request);
        cache.put(request, response.clone());
        return response;
      } catch (e) {
        // If fetch fails and we don't have it cached, just let it error
        return fetch(request);
      }
    })());
  }
});
