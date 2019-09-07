// var userId = document.querySelector('meta[property="dyapi:userid"]').content;
// var sessionID = document.querySelector('meta[property="dyapi:sessionid"]').content;

callRecommendations();

function callRecommendations(){
    // return new Promise(function(resolve, reject){
        var userID = 'u62d986ab7e';
        var sessionID = 'iquahngaishe2koh';

        var data = {
          user: {
              id : userID
          },
          sessionId : sessionID,
            selector : {
              names: ['API recs']
            },
            context : {
              page : {
                  type : 'HOMEPAGE',
                  data : [],
                  location : 'https://suharevaeliza.github.io/pages/recommendations.html'
              }
            }
        };

        var xhr = new XMLHttpRequest();

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === this.DONE) {
                console.log(this.responseText);
            } else {
                console.log(this.responseText);
            }
        });

        xhr.open("POST", "https://cors-anywhere.herokuapp.com/https://dy-api.com/v2/serve/user/choose");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("dy-api-key", "f205138651b370352c58fa1e88e0da801fc2b1f4a1050c60f4aa346d1e36166a");

        xhr.send(JSON.stringify(data));
    // })
}
