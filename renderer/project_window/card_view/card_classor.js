const cardBoard = document.getElementById("card-board");
import magicNav from "../../../module/Magic_Nav/magic_nav_main.js";

let currentProjectPath = null;

window.addEventListener("message", async event => {


  if (event.data.type === "folder-selected"){
    await displayFolderCards(
      event.data.path,
      event.data.projectPath
    );
    return;
  }

  if (event.data.type ==="folder-unselected") {
    cardBoard.innerHTML = "";
  }
}); 

window.addEventListener("message", async event => {

  if(event.data.type !== "select-card-image"){
    return;
  } 

  const result = await window.parent.electronAPI.selectCardImage(
    event.data.cardPath,
    currentProjectPath
  );

  if (!result.success || result.canceled) {
    return;
  }

  event.source.postMessage({
    type: "card-image-selected",
    imageUrl: result.imageUrl
  }, "*");

});

async function displayFolderCards(folderPath, projectPath) {
  
  cardBoard.innerHTML = "";
  currentProjectPath = projectPath;

  const result = await window.parent.electronAPI.getFolderCards(
    folderPath,
    projectPath
  );

  if(!result.success){
    alert(result.message);
    return;
  }

  for (const card of result.cards){
    createCardFrame(card);
  }
}

function createCardFrame(card) {
  const frame = document.createElement("iframe");

  frame.src = "card_view.html";
  frame.className = "card-frame";
  frame.scrolling = "no";

  
  frame.addEventListener("load", () => {
      magicNav.messages.emit
      (window, 
        frame.contentWindow, 
        magicNav.messages.magicNavMessages.displayCard(card));

  });

  cardBoard.appendChild(frame);

}

magicNav.messages.receive(window, event => {

  if(event.data.type !== "open-wiki" && event.data.type !== "open-big-card")
  {
    return;
  }

  console.log("[CARD_CLASSOR] emit : ", event.data.type); 

  magicNav.messages.emit(window, window.parent, event.data);

})
