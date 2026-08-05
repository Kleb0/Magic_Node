const cardTitle = document.getElementById("card-title");
const cardImageZone = document.getElementById("card-image-zone");
const cardImage = document.getElementById("card-image");
const cardImagePlaceholder = document.getElementById("card-image-placeholder");
const cardDescription = document.getElementById("card-description");

const openWikiButton = document.getElementById("open-wiki-button");

let currentCard = null;

function displayCard(card){

    console.log(card);
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

function clearImage(){

    cardImage.removeAttribute("src");

    cardImage.style.display = "none";

    cardImagePlaceholder.style.display = "flex";

}

window.addEventListener("message",(event)=>{

    if(event.data.type === "display-card"){
        displayCard(event.data.card);
    }

    if(event.data.type === "card-image-selected"){
        displayImage(event.data.imageUrl);
    }

});

cardImageZone.addEventListener("click", async () => {

  if(!currentCard) {
    return;
  }

  console.log("dialogue image card zone before")

  const result = await window.parent.electronAPI.selectCardImage(currentCard.path, currentCard.projectPath);

  console.log("dialogue image card zone after ")
  if(!result.success || result.canceled) {
    return;
  }

  displayImage(result.imageUrl);

});

openWikiButton.addEventListener("click",()=>{

    if(!currentCard){
        return;
    }

    window.parent.postMessage({

        type:"open-wiki",
        card:currentCard

    },"*");

});
