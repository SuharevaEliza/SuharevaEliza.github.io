var CACHE_NAME = 'myTestCache';
var urlsToCache = [
    '/index.html',
    '/pages/contacts.html',
    '/style.css',
    '/script.js',
];

// INSTALLATION
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache');
                cache.addAll(urlsToCache.map(function(urlToCache) {
                    return new Request(urlToCache, { mode: 'no-cors' });
                })).then(function() {
                    console.log('All resources have been fetched and cached.');
                });
            })
    );
});


// RETURNING REQUESTS
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {

                // if any match in cache found === ENSURES CACHE FIRST PRINCIPLE
                if (response) {
                    return response;
                }

                //otherwise return result of fetch (makes a network request, returns anything that can be received)
                return fetch(event.request)
                    .then(function (response) {

                        // clone the response (to capture it from the stream) -
                        // we want to pass it to browser and cache
                        var responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(function (cache) {
                                if (event.request.method === "GET") {
                                    cache.put(event.request, responseToCache);
                                } else {
                                    client.postMessage({
                                        msg: "Hey I just got a fetch from you!",
                                        url: event.request.url
                                    });
                                }
                            });
                        return response.clone();
                    });
            })
    )
});

// CACHE MANAGEMENT IN ACTIVATION
self.addEventListener('activate', function (event) {
    var cacheWhitelist = ['myTestCache'];

    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            )
        })
    )
});
