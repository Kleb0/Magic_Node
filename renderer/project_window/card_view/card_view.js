const cardTitle = document.getElementById("card-title");
const cardImageZone = document.getElementById("card-image-zone");
const cardImage = document.getElementById("card-image");
const cardImagePlaceholder = document.getElementById("card-image-placeholder");
const cardDescription = document.getElementById("card-description");

let currentCard = null;

function displayCard(card) {
  currentCard = card;

  cardTitle.textContent = card.name;
  cardDescription.textContent = card.content || "";

  if(card.imageUrl){
    displayImage(card.imageUrl);
    return;
  }

  clearImage();
}

function displayImage(imageUrl){
  cardImage.src = imageUrl;
  cardImage.style.display = "block";
  cardImagePlaceholder.style.display = "none";
}

window.addEventListener("message", event => {
  
  if(event.data.type ==="display-card") {
    displayCard(event.data.card); 
  }

  if(event.data.type ==="card-image-selected"){
    displayImage(event.data.imageUrl);
  }
});

cardImageZone.addEventListener("click", () => {
  if(!currentCard) {
    return;
  }

  window.parent.postMessage({
    type:"select-card-image",
    cardPath: currentCard.path
  }, "*");
});
