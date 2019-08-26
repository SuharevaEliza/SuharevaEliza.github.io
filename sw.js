var CACHE_NAME = 'myTestCache';
var urlsToCache = [
    '/index.html',
    '/pages/recommendations.html',
    '/style.css',
    '/script.js'
];

// INSTALLATION
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});


// RETURNING REQUESTS
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {

                // if any match in cache found
                if(response) {
                    return response;
                }

                //otherwise return result of fetch (makes a network request, returns anything that can be received)
                return fetch(event.request)
                    .then(function (response) {

                        // ensure the response is valid
                        // ('basic' indicates a request from our origin - requests to 3rd party are not cached)
                        if(!response || response.status !== 200 || response.type !== 'basic') {
                            return response
                        }

                        // clone the response (to capture it from the stream) -
                        // we want to pass it to browser and cache
                        var responseToCache = response.clone();


                        caches.open(CACHE_NAME)
                            .then(function (cache) {
                                cache.put(event.request, responseToCache)
                            });

                        return response;
                    })
            })
    )
});
