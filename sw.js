var  CACHE_NAME = 'myTestCache';
var urlsToCache = [
    '/index.html',
    '/pages/recommendations.html',
    '/style.css',
    '/script.js'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});
