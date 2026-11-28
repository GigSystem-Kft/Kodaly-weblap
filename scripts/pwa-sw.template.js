/* Zeneelméleti Műhely PWA – build-specific, public shell only.
 * NEVER cache API requests, cookie-authenticated account pages, progress,
 * chat, tutor answers, admin mutations, PDF media or user-uploaded material.
 * __PWA_CACHE_VERSION__ and __PWA_SHELL_JSON__ are replaced AFTER vite build.
 */
const CACHE_PREFIX = 'zm-public-shell-';
const CACHE_VERSION = __PWA_CACHE_VERSION__;
const CACHE_NAME = CACHE_PREFIX + CACHE_VERSION;
const SHELL_PATHS = __PWA_SHELL_JSON__;
const CACHEABLE = new Set(SHELL_PATHS);
const ORIGIN = self.location.origin;

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Requests deliberately omit cookies and refresh HTTP caches. If any
    // entrypoint is missing during a partial CloudPanel upload, installation
    // rejects instead of installing an incomplete offline site.
    const requests = SHELL_PATHS.map(file =>
      new Request(new URL(file, ORIGIN), {credentials:'omit',cache:'reload'}));
    await cache.addAll(requests);
    // Updates wait until the user accepts. Do not mix in-use JS versions.
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names
      .filter(name => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
      .map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== ORIGIN) return;
  const path = url.pathname;

  // AUTHENTICATED AND/OR DYNAMIC: pass through untouched and never store.
  if (path === '/api' || path.startsWith('/api/')) return;
  if (request.headers.has('Authorization')) return;

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        // Prefer live navigation: latest published editorial copy is fetched
        // by the client separately, so only static bundled content is offline.
        return await fetch(request);
      } catch {
        const cache = await caches.open(CACHE_NAME);
        return (await cache.match(new URL('/index.html', ORIGIN))) ||
          (await cache.match(new URL('/offline.html', ORIGIN))) ||
          Response.error();
      }
    })());
    return;
  }

  if (CACHEABLE.has(path) && !url.search) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const entry = await cache.match(new URL(path, ORIGIN));
      return entry || fetch(request);
    })());
  }
});
