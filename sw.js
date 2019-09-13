var CACHE_NAME = 'myTestCache';
var urlsToCache = [
    '/index.html',
    '/pages/contacts.html',
    '/pages/recommendations.html',
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
self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response){
                if(event.request.method === 'GET'){
                    if (response) {
                        return response;
                    }
                    return fetch(event.request)
                        .then(function (response) {

                            // clone the response (to capture it from the stream) -
                            // we want to pass it to browser and cache
                            var responseToCache = response.clone();

                            return caches.open(CACHE_NAME)
                                .then(function (cache) {
                                    cache.put(event.request, responseToCache);
                                    return response;
                                })
                        });
                } else {
                    console.log('POST request');
                    console.log(event);
                    console.log(event.request.text());
                    return fetch(event.request)
                        .then(function (response) {
                            console.log('POST request success');
                            console.log(response.clone());
                            return response;
                        })
                        .catch(function(err) {
                            console.log('POST request fail: ' + err);
                            self.clients.matchAll()
                                .then(function (clients) {
                                    clients.forEach(function (client) {
                                        client.postMessage({
                                            message: 'Sorry, this resource is not available offline!',
                                            url: event.request.url,
                                            body: event.request.text()
                                        });
                                    });
                                    return response;
                                });
                        });
                }
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
