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

// sendCachedPostRequests();

var getButton = document.querySelector('#get');
var postButton = document.querySelector('#post');


getButton.addEventListener('click', sendGetRequest);
postButton.addEventListener('click', sendPostRequest);

function sendGetRequest(){
    sendRequest('GET', this);
    reportGet()
        .catch(function(){
            console.log('didnt succeed');
            store();
        });
}

function sendPostRequest(){
    if(navigator.onLine) {
        sendRequest('POST', this);
    } else {
        store();
    }
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

function reportGet(){
    return new Promise(function(resolve){
        var userID = 'u62d986ab7e';
        var sessionID = 'iquahngaishe2koh';

        var data = {
            user: {
                id : userID
            },
            sessionId : sessionID,
            events : [{
                name: 'GET clicked',
                properties: {}
            }]
        };

        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                resolve(JSON.parse(xhr.responseText));
            } else {
                reject();
            }
        };

        xhr.open("POST", "https://cors-anywhere.herokuapp.com/https://dy-api.com/v2/collect/user/event");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("dy-api-key", "f205138651b370352c58fa1e88e0da801fc2b1f4a1050c60f4aa346d1e36166a");

        xhr.send(JSON.stringify(data));
    })
}

function store() {
    console.log('storing');
    localforage.setItem('newPostRequest', 'one');
}

function sendCachedPostRequests(){
    localforage.getItem('newPostRequest')
        .then(function(){
            reportGet();
            localforage.removeItem('newPostRequest');
        })
}
