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

var getButton = document.querySelector('#get');
var postButton = document.querySelector('#post');


getButton.addEventListener('click', sendGetRequest);
postButton.addEventListener('click', sendPostRequest);

function sendGetRequest(){
    sendRequest('GET', this);
}

function sendPostRequest(){
    sendRequest('POST', this);
}

function sendRequest(method, button){
    var url = 'https://enxzlv51hgx4a.x.pipedream.net/';
    var oReq = new XMLHttpRequest();

    oReq.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            // var message = document.querySelector("#message");
            // message.style.setProperty('display', 'block');
            var oldText = button.textContent;
            button.textContent = oReq.responseText;
            button.classList.toggle('success');
            setTimeout(function () {
                button.textContent = oldText;
                button.classList.toggle('success');
            }, 1500)
        }
    };

    oReq.open(method, url);
    oReq.send('');
}
