// Lumen PWA Service Worker
// Cache strategy: cache-first for app shell, network-first for everything else.
// Bump CACHE_VERSION when shipping a new release to invalidate old caches.

const CACHE_VERSION = 'lumen-v1-2026-04';
const APP_SHELL = [
  '/app.html',
  '/manifest.webmanifest',
  '/lumen-tokens.js',
  '/ios-frame.jsx',
  '/lumen-ui.jsx',
  '/lumen-screens.jsx',
  '/lumen-v2.jsx',
  '/lumen-v3-shell.jsx',
  '/lumen-v3-screens.jsx',
  '/lumen-v3-guest.jsx',
  '/lumen-v3-app.jsx',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/apple-touch-icon.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_VERSION).then((cache) =>
      cache.addAll(APP_SHELL).catch(() => {
        // If any asset fails (e.g. dev), still install — we'll cache lazily.
      })
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Don't cache cross-origin (Google Fonts, unpkg, etc) — let browser handle it.
  if (url.origin !== self.location.origin) return;

  // App shell: cache-first
  if (e.request.mode === 'navigate' || APP_SHELL.includes(url.pathname)) {
    e.respondWith(
      caches.match(e.request).then(
        (cached) =>
          cached ||
          fetch(e.request).then((res) => {
            const clone = res.clone();
            caches.open(CACHE_VERSION).then((c) => c.put(e.request, clone));
            return res;
          }).catch(() => caches.match('/app.html'))
      )
    );
    return;
  }

  // Everything else: network-first, fall back to cache.
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const clone = res.clone();
        caches.open(CACHE_VERSION).then((c) => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
