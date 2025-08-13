// Service Worker for API caching
const CACHE_NAME = 'streamflix-api-v1';
const API_CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours

self.addEventListener('fetch', event => {
  if (event.request.url.includes('api.themoviedb.org')) {
    event.respondWith(handleApiRequest(event.request));
  }
});

async function handleApiRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  
  if (cached) {
    const cacheTime = cached.headers.get('sw-cache-time');
    if (cacheTime && Date.now() - parseInt(cacheTime) < API_CACHE_DURATION) {
      return cached;
    }
  }
  
  try {
    const response = await fetch(request);
    const responseClone = response.clone();
    responseClone.headers.set('sw-cache-time', Date.now().toString());
    cache.put(request, responseClone);
    return response;
  } catch (error) {
    return cached || new Response('Network error', { status: 503 });
  }
}