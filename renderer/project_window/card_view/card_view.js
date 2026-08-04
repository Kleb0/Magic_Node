const cardTitle = document.getElementById("card-title");
const cardImageZone = document.getElementById("card-image-zone");
const cardImage = document.getElementById("card-image");
const cardImagePlaceholder = document.getElementById("card-image-placeholder");
const cardDescription = document.getElementById("card-description");

let currentCard = null;

const openWikiButton = document.getElementById("open-wiki-button");
const openBigCardButton = document.getElementById("open-big-card-button");

console.log("test openWikiButton : " + openWikiButton);

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

function clearImage() {

  cardImage.removeAttribute("src");
  cardImage.style.display = "none";
  cardImagePlaceholder.style.display = "block";

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

  window.parent.postMessage({type:"select-card-image", cardPath: currentCard.path }, "*");
});


openBigCardButton.addEventListener("click", () => {

  if(!currentCard) {
    return;
  }

  window.parent.postMessage({type: "open-big-card", card: currentCard }, "*");
});

openWikiButton.addEventListener("click", () => {
 

  if(!currentCard){
    return;
  }

  window.parent.postMessage({type: "open-wiki", card: currentCard},"*");

});
