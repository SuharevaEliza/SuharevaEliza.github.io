// var localforage = import('/localforage')

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

navigator.serviceWorker.addEventListener('message', function(event) {
    if(!navigator.onLine){
        alert(event.data.message + "\r\n (" + event.data.url + ")");
    }
});


var getButton = document.querySelector('#get');
var postButton = document.querySelector('#post');


getButton.addEventListener('click', sendGetRequest);
postButton.addEventListener('click', sendPostRequest);

function sendGetRequest(){
    sendREQ('https://image.flaticon.com/icons/svg/742/742751.svg')
        .then(function(data){
            var oldText = getButton.textContent;

            getButton.innerHTML = data;
            getButton.classList.toggle('success');

            setTimeout(function () {
                getButton.textContent = oldText;
                getButton.classList.toggle('success');
            }, 1500)
        });
}

function sendPostRequest(){
    sendRequest('POST', this);
    reportPOST();
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

function sendREQ(url) {
    return new Promise(function (resolve) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                resolve(xhr.responseText);
            }
        };

        xhr.open("GET", url, true);
        xhr.send();
    })
}

function reportPOST(){
    return new Promise(function(resolve){
        var userID = 'u62d986ab7e';
        var sessionID = 'iquahngaishe2koh';

        var data = {
            user: {
                id : userID
            },
            sessionId : sessionID,
            events : [{
                name: 'POST clicked',
                properties: {}
            }]
        };

        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                resolve(JSON.parse(xhr.responseText));
            }
        };

        xhr.open("POST", "https://cors-anywhere.herokuapp.com/https://dy-api.com/v2/collect/user/event");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("dy-api-key", "f205138651b370352c58fa1e88e0da801fc2b1f4a1050c60f4aa346d1e36166a");

        xhr.send(JSON.stringify(data));
    })
}
