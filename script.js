console.log('script enabled');

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('sw.js').then(function(registration) {
            console.log(registration);
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

var button = document.querySelector('#button');
button.addEventListener('click', sendEvent);

function sendEvent() {
    localforage.setItem('somekey', 'my xml request').then(function (value) {
        console.log('set value: '+ value);
    }).catch(function(err) {
        console.log(err);
    });
}
