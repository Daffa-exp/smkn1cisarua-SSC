const CACHE_NAME = 'ssc-shell-v4';
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/announcements',
  '/schedule',
  '/events',
  '/reports',
  '/lost-found',
  '/notifications',
  '/profile',
  '/ai',
  '/login',
  '/manifest.json',
  '/favicon.png',
  '/icon-192.png',
  '/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API routes: network only (no stale data)
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // Static assets: cache first
  if (request.destination === 'image' || request.destination === 'font' || request.destination === 'style' || request.destination === 'script') {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // Navigation: network first, fallback to cache
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cached) => {
            return cached || caches.match('/');
          });
        })
    );
    return;
  }

  // Default: network first
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});

// Real Web Push notification, delivered even when SSC is closed or in the
// background. The payload shape sent by the server is:
// { title, body, url, notificationId }
self.addEventListener('push', (event) => {
  if (!event.data) return;

  let data = {};
  try {
    data = event.data.json();
  } catch (err) {
    console.error('[SSC] Error parsing push payload:', err);
    return;
  }

  const title = data.title || 'SMKN 1 CISARUA CONNECT';
  const options = {
    body: data.body || data.message || 'Pemberitahuan baru dari sekolah.',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: data.notificationId ? `ssc-${data.notificationId}` : undefined,
    data: { url: data.url || '/notifications', notificationId: data.notificationId },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/notifications';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Reuse an already-open SSC tab/window instead of opening a new one.
      for (const client of windowClients) {
        const clientPath = (() => {
          try {
            return new URL(client.url).pathname;
          } catch {
            return client.url;
          }
        })();

        if (clientPath === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }

      // No matching tab open: focus any existing SSC window and navigate it,
      // or open a brand new one if none exists.
      for (const client of windowClients) {
        if ('focus' in client && 'navigate' in client) {
          return client.focus().then(() => client.navigate(urlToOpen));
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
