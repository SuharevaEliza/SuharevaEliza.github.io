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

var button = document.querySelector('#button');
button.addEventListener('click', sender);

function sender(){
    var oReq = new XMLHttpRequest();
    var url = 'https:​//dy-api.com/v2​/collect/user/event';
    var body = {
        'user' : {
            'id' : '5273715487327152493'
        },
        'sessionId' : 'e89f7ab43ce281248b090bd460d7a1ac',
        'events' : [
            {
                'name' : 'Clicks fired',
                'properties' : {}
            }
        ]
    };

    oReq.addEventListener('loadend', function() {
        console.log(oReq.responseText);
    });

    oReq.open('POST', url);
    oReq.withCredentials = true;
    oReq.setRequestHeader('DY-API-Key', 'c1a70218059b474d483a6a2d41b961ee455f7734f7575f34aa85a8f3e3f8a60e');
    oReq.setRequestHeader('Content-Type', 'application/json');
    oReq.send(body);
}
