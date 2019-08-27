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

var buttons = [].slice.call(document.querySelectorAll('#clicks button'));
buttons.forEach(function(button){
    button.addEventListener('click', sendRequest);
});


function sendRequest(){
    var url = 'https://enh6y4mdg615v.x.pipedream.net/';
    var method = 'GET';
    var oReq = new XMLHttpRequest();

    oReq.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            var message = document.querySelector("#message");
            message.style.setProperty('display', 'block');
            message.innerHTML = oReq.responseText;
            setTimeout(function () {
                message.style.setProperty('display', 'none');
            }, 2500)
        }
    };

    oReq.open(method, url);
    oReq.send('');
}
