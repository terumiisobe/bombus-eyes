const CACHE_NAME = 'bombus-eyes-v1';
const API_URL = 'https://bombus.onrender.com/colmeias';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const requestURL = new URL(event.request.url);

  // Handle API requests
  if (requestURL.href === API_URL) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async cache => {
        try {
          // Try network first
          const networkResponse = await fetch(event.request);
          if (networkResponse.ok) {
            // Cache the fresh response
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          }
          throw new Error('Network response not ok');
        } catch (error) {
          // Network failed, try cache
          const cachedResponse = await cache.match(event.request);
          if (cachedResponse) {
            return cachedResponse;
          }
          // Return a fallback response if no cache
          return new Response(JSON.stringify({ error: 'Offline - no cached data' }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }
      })
    );
    return;
  }

  // Handle static assets
  if (requestURL.origin === location.origin) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            return response;
          }
          return fetch(event.request).then(response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            return response;
          });
        })
    );
    return;
  }

  // For other requests, try network first, fallback to cache
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request);
      })
  );
});