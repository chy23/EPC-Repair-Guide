// Service Worker for Liyuan Computer Guide
const CACHE_NAME = 'ly-guide-v4';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/style.css',
  './js/data.js',
  './js/app.js',
  './manifest.json',
  './assets/favicon.svg',
  './assets/images/bios_step_1.png',
  './assets/images/bios_step_2.png',
  './assets/images/bios_step_3.png',
  './assets/images/bios_step_4.png',
  './assets/images/bios_step_5.png',
  './assets/images/bios_step_6.png',
  './assets/images/bios_step_7.png',
  './assets/images/bios_page_1.png',
  './assets/images/bios_page_2.png',
  './assets/images/bios_page_3.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      }).catch(() => {
        // Offline fallback
        return cachedResponse;
      });
    })
  );
});
