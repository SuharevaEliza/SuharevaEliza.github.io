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

const dyJwt = document.querySelector('meta[property="dyapi:jwt"]').content;
const dyUserId = document.querySelector('meta[property="dyapi:userid"]').content;
const dySessionId = document.querySelector('meta[property="dyapi:sessionid"]').content;

var button = document.querySelector('#button');
button.addEventListener('click', addToCart);

function callDY(path, body) {
    body.user = { id: dyUserId };
    body.sessionId = dySessionId;

    return fetch(`https://direct-collect.dy-api.com/v2${path}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${dyJwt}`,
            'Content-Type': 'application/json',
        },
        cache: 'no-cache',
        body: JSON.stringify(body),
    });
}

async function addToCart(event) {
    await callDY('/collect/user/event', {
        events: [
            {
                name: 'Clicks fired',
                properties: {}
            },
        ],
    });
}
