import { refreshFolderTree} from "./project_window.js";

export function initializeCardManager(cardArea, getSelectedItem, projectPath, clearSelection){

  const cardModal = document.getElementById("card-modal");
  const newCardName = document.getElementById("new-card-name");
  const createCardButton = document.getElementById("create-card");
  const newCardNameContext = document.getElementById("new-card-name-context");
  const renameSelectedFileButton = document.getElementById("rename-selected-file");
  const deleteSelectedFileButton = document.getElementById("delete-selected-file");
  const contextMenu = document.getElementById("context-menu");

  cardArea.addEventListener("contextmenu", (event) => {

    console.log(event.target);

    event.preventDefault();

    if(event.target.closest(".folder")){
      return;
    }

    cardModal.style.left = `${event.pageX}px`;
    cardModal.style.top = `${event.pageY}px`;
    newCardName.value = "";
    contextMenu.classList.add("hidden");
    document.body.classList.add("modal-open");

    cardModal.classList.remove("hidden");
    newCardName.focus();

  });


  document.addEventListener("click", (event) => {

    if(cardModal.contains(event.target)){
      return;
    }

    if(cardArea.contains(event.target)){
      return;
    }

    cardModal.classList.add("hidden");

    if(contextMenu.classList.contains("hidden")){
      document.body.classList.remove("modal-open");
    }

  });

  createCardButton.addEventListener("click", async () => {

    const cardName = newCardName.value.trim();

    if (cardName === ""){
      return;
    }

    const selectedItem = getSelectedItem();

    let destinationFolder = projectPath;

    if (selectedItem) {
        
        if(selectedItem.type === "folder") {
        destinationFolder = selectedItem.path;
      } else {
        destinationFolder = selectedItem.path;
      }
    }

    const result = await window.electronAPI.createCard(projectPath, destinationFolder, cardName);

    if(!result.success){
      alert(result.message);
      return;
    }

    cardModal.classList.add("hidden");

    await refreshFolderTree();
  });

  renameSelectedFileButton.addEventListener("click", async () => {

    const selectedItem = getSelectedItem();

    if (selectedItem === null || selectedItem.type !== "card") {
      return;
    }

    const newName = newCardNameContext.value.trim();

    if (newName === ""){
      return;
    }

    const result = await window.electronAPI.renameCard(
      projectPath,
      selectedItem.path,
      newName
    );

    if(!result.success){
      alert(result.message);
      return;
    }

    await refreshFolderTree();

  })

  deleteSelectedFileButton.addEventListener("click", async () => {

    const selectedItem = getSelectedItem();

    if (selectedItem === null || selectedItem.type !== "card" ) {
      return;
    }

    console.log ("Delete" + selectedItem.path);
    const confirmed = confirm(`Delete file "${selectedItem.name}"?`);

    if(!confirmed){
      return;
    }

    const result = await window.electronAPI.deleteCard(projectPath, selectedItem.path);

    if(!result.success) {
      alert (result.message);
      return;
    }

    contextMenu.classList.add("hidden");

    clearSelection();

    window.dispatchEvent(new CustomEvent("card-deleted", {
      detail: {
        parentFolder : selectedItem.parent
      }
    }));

    await refreshFolderTree();

  })

}

