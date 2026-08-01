const cardBoard = document.getElementById("card-board");


window.addEventListener("message", async (event) => {
  
  if (event.data.type !== "folder-selected"){
    return;
  }

  cardBoard.innerHTML = "";

  const result = await window.parent.electronAPI.getFolderCards(
      event.data.path
  );

  if(!result.success){
    alert(result.message);
    return;
  }
  const cards = result.cards;

  for (const card of cards) {

    const frame = document.createElement("iframe");

    frame.src = "card_view.html";
    frame.className = "card-frame";
    frame.scrolling = "no";

    frame.addEventListener("load", ()=> {

      const title = frame.contentDocument.getElementById("card-title");
      title.textContent = card.name;
    });

    cardBoard.appendChild(frame);

  }

}); 
