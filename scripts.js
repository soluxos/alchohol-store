// Image Error Function
function ImgError(source){
    source.src = "dist/images/missing.png";
    source.onerror = "";
    return true;
}

var app = document.getElementById('root');
var container = document.createElement('div');
container.setAttribute('class', 'container');
app.appendChild(container);

// Get Request
var request = new XMLHttpRequest();
request.open('GET', 'https://demo8465751.mockable.io/products', true);
request.onload = function () {

  	// Begin accessing JSON data here and filter out the % symbol for alchohol.
  	var data = JSON.parse(this.response);
  	var stringified = JSON.stringify(data);
  	stringified = stringified.replace(/\alcohol_%/g, 'alchohol_percentage')
  	var jsonObject = JSON.parse(stringified);


  	if (request.status >= 200 && request.status < 400) {
   		jsonObject.slice(0, 9).forEach(products => {

   			// Create Div and set to Card
	     	var card = document.createElement('div');
	      	card.setAttribute('class', 'card');

	      	// Pull through beer element.
	      	var productTitle = document.createElement('h2');
	      	productTitle.textContent = products.beer;

	      	// Product Image
	      	var image = document.createElement('img');
	      	image.setAttribute('src', products.image_url);
	      	image.setAttribute('onerror', "ImgError(this)")

	      	// Price
	      	var price = document.createElement('h2');
	      	price.textContent = products.price;
	      	price.setAttribute('class', 'price');

	      	var additionalDetails = document.createElement('div');
	      	additionalDetails.setAttribute('class', 'additional-details');

	      	// Alchohol Percentage
	      	var percentage = document.createElement('h3');
	      	percentage.innerHTML = '<span>%:</span>' + products.alchohol_percentage;

	      	// Product Size
	      	var size = document.createElement('h3');
	      	size.innerHTML =  '<span>Size:</span>' + products.size;

	      	// Rating
	      	var starsCount = products.average_review_rating_0_to_5;
	      	var stars = document.createElement('div');
	      	stars.setAttribute('class', 'stars');

			// Add Card element to the container
	      	container.appendChild(card);

	      	// Load In Card Elements.
	      	card.appendChild(price);
	      	card.appendChild(stars);
	      	for ( var i = 0; i < starsCount; i++ ) {
	      		var star = document.createElement('img');
	      		star.setAttribute('src', 'dist/images/star.svg');
	      		stars.appendChild(star);
	      		console.log('added a star');
	      	}
	      	card.appendChild(image);
	      	card.appendChild(productTitle);

	      	card.appendChild(additionalDetails);

	      	// Load Additional Details
	      	additionalDetails.appendChild(size);
	      	additionalDetails.appendChild(percentage);

    	});
  	} 
}

request.send();