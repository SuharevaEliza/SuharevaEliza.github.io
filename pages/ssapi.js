callRecommendations()
    .then(function(data){
        console.log(data);
        var div = document.querySelector('#recommendations-div');
        var products = data.choices[0].variations[0].payload.data.slots;

        products.forEach(function(product){
            var productContainer = document.createElement('a');
            productContainer.classList.add('recommendations-product');
            productContainer.href = product.productData.url;
            productContainer.dataset.dySku = product.sku;

            var img = document.createElement('img');
            img.src = product.productData.image_url;
            productContainer.appendChild(img);

            var name = createDiv();
            name.innerText = product.productData.name;
            productContainer.appendChild(name);

            var price = createDiv();
            price.textContent = product.productData.price;
            productContainer.appendChild(price);

            div.appendChild(productContainer);
        })
    });

function callRecommendations(){
    return new Promise(function(resolve){
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

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                resolve(JSON.parse(xhr.responseText));
            }
        };

        xhr.open("POST", "https://cors-anywhere.herokuapp.com/https://dy-api.com/v2/serve/user/choose");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("dy-api-key", "f205138651b370352c58fa1e88e0da801fc2b1f4a1050c60f4aa346d1e36166a");

        xhr.send(JSON.stringify(data));
    })
}
function createDiv(){
    return document.createElement('div');
}
