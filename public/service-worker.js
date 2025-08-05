const CACHE_NAME = 'offline-api-cache-v1';
const API_URL = 'https://bombus.onrender.com/colmeias';

self.addEventListener('install', event => {
  self.skipWaiting(); // Activate worker immediately
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim()); // Become available to all pages
});

self.addEventListener('fetch', event => {
  const requestURL = new URL(event.request.url);

  if (requestURL.href === API_URL) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async cache => {
        try {
          const networkResponse = await fetch(event.request);
          cache.put(event.request, networkResponse.clone()); // Cache fresh response
          return networkResponse;
        } catch (error) {
          // No network, return from cache
          return cache.match(event.request);
        }
      })
    );
  }
});