const cacheName = '_offline-v1';
const assets = ['/', '/index.html', '/index.css', '/index.js', 'http://api.openweathermap.org/data/2.5/weather'];

self.addEventListener('install', evt => {
    evt.waitUntil(
        caches.open(cacheName).then(cache => {
            cache.addAll(assets);
        }).catch(error => console.log('Error while caching...'))
    );
});

self.addEventListener('activate', evt => {
    evt.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys.map((key) => {
                if (key !== cacheName) {
                  return caches.delete(key);
                }
            }));
        })
    )
});

self.addEventListener('fetch', evt => {
    evt.respondWith(async function() {
        const cache = await caches.open(cacheName);
        const cachedResponse = await cache.match(evt.request);
        const networkResponsePromise = fetch(evt.request);
    
        evt.waitUntil(async function() {
          const networkResponse = await networkResponsePromise;
          await cache.put(evt.request, networkResponse.clone());
        }());
    
        return cachedResponse || networkResponsePromise;
      }());
});