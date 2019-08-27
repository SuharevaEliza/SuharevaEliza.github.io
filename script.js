console.log('oy');

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


var map = document.querySelector('#map');

function initMap() {
    var location = {lat: -25.344, lng: 131.036};
    var map = new google.maps.Map(
        document.getElementById('map'), {zoom: 4, center: location});
    var marker = new google.maps.Marker({position: location, map: map});
}
