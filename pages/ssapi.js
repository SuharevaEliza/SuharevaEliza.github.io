var userId = document.querySelector('meta[property="dyapi:userid"]').content;
var sessionID = document.querySelector('meta[property="dyapi:sessionid"]').content;

callRecommendations();

function callRecommendations(){
    var body = {
        "user": {
            "id": userId
        },
        "sessionId": sessionID,
        "selector": {
            "names": ["API recs"]
        },
        "context": {
            "page": {
                "type": "HOMEPAGE",
                "data": [],
                "location": "https://suharevaeliza.github.io/pages/contacts.html"
            },
            "device": {
                "ip": "172.17.0.1",
                "userAgent": "Mozilla/5.0 (X11; ; U; Linux armv7l; en-us)"
            }
        }
    }

    return fetch(`https://direct.dy-api.com/v2/serve/user/choose`, {
        method: 'POST',
        headers: {
            'DY-API-Key': `f205138651b370352c58fa1e88e0da801fc2b1f4a1050c60f4aa346d1e36166a`,
            'Content-Type': 'application/json',
        },
        cache: 'no-cache',
        body: JSON.stringify(body)
    });
}



