import { initializeCardManager } from "./card_manager.js";

const params = new URLSearchParams(window.location.search);

const projectPath = params.get("path");

const projectName = projectPath.split("\\").pop();

document.querySelector("h1").textContent =  projectName;

let folders = [];

const cardArea = document.getElementById("card-area");
const cardView = document.getElementById("card-view");

const tree = document.getElementById("folder-tree");
const folderTreePanel = document.getElementById("folder-tree-panel");

const content = document.getElementById("project-content");

const selectedFolderName = document.getElementById("selected-folder-name");
const cardModal = document.getElementById("card-modal");

const contextMenu = document.getElementById("context-menu");

const folderContextMenu = document.getElementById("folder-context-menu");
const cardContextMenu = document.getElementById("card-context-menu");

const newFolderName = document.getElementById("new-item-name");
const createFolderButton = document.getElementById("create-folder");
const createFileButton = document.getElementById("folder-context-create-file");

const renameFolderButton = document.getElementById("rename-folder");
const deleteFolderButton = document.getElementById("delete-folder");

let selectedItem = null;

initializeCardManager(cardArea, ()=> selectedItem, projectPath, clearSelection);

const dragGhost = document.getElementById("drag-ghost");

let draggedItem = null;
let dragStartPosition = null;
let dropOnProjectRoot = false;
let targetFolder = null;
let isDragging = false;


function clearSelection(){

  document.querySelectorAll(".folder-item").forEach(item => {
    item.classList.remove("selected");
  });

  selectedItem = null;

  selectedFolderName.textContent = "";

  document.getElementById("selected-folder-header").classList.add("hidden");

  deleteFolderButton.classList.add("hidden")
  renameFolderButton.classList.add("hidden")

  cardView.contentWindow.postMessage(
    {
      type:"folder-selected",
      name: projectName,
      path: projectPath,
      projectPath
    },
    "*"
  );

}

folderTreePanel.addEventListener("mouseenter", () => {

  if(isDragging){
    
    targetFolder = null;

    document.querySelectorAll(".folder-item").forEach(item => item.classList.remove("drop-target"));

    folderTreePanel.classList.add("project-drop-target");

    return;

  }
  folderTreePanel.classList.add("hovering");
  
});

folderTreePanel.addEventListener("mouseleave", () => {

  folderTreePanel.classList.remove("hovering");
  folderTreePanel.classList.remove("project-drop-target");

});

folderTreePanel.addEventListener("click", (event) => {
  
 if (event.target.closest(".folder-item")){
    return;
  }
  clearSelection();
  
});

folderTreePanel.addEventListener("contextmenu", (event) => {
  
  event.preventDefault();

  if (event.button !== 2){
    return;
  }


  contextMenu.style.left = `${event.pageX}px`;
  contextMenu.style.top = `${event.pageY}px`;

  contextMenu.classList.remove("hidden");

  folderContextMenu.classList.add("hidden");
  cardContextMenu.classList.add("hidden");

  if (selectedItem == null){
    
    folderContextMenu.classList.remove("hidden");

  } else if (selectedItem.type === "folder"){
     
    folderContextMenu.classList.remove("hidden");

  } else if (selectedItem.type === "card"){

      cardContextMenu.classList.remove("hidden");
  }

  newFolderName.value = "";
  newFolderName.focus();


});

document.addEventListener("click", (event) => {

  if(folderTreePanel.contains(event.target)){
      return;
  }

  if(cardModal.contains(event.target)){
    return;
  }

  if (contextMenu.contains(event.target)){
    return;
  }

  clearSelection();

});

function displayItems(items, parentElement = tree, level = 0) {

  items.forEach(item => {

    if (item.type === "card") {

      const cardRow = document.createElement("div");

      cardRow.className = "folder-item";
      cardRow.style.paddingLeft = `${10 + level * 20}px`;

      cardRow.textContent = item.name + " 📄 ";

      cardRow.addEventListener("click", () => {

        document.querySelectorAll(".folder-item").forEach(element => element.classList.remove("selected")); 

        cardRow.classList.add("selected");

        selectedItem = item;

        selectedFolderName.textContent = item.name;

        document.getElementById("selected-folder-header").classList.remove("hidden");


      })

      cardRow.addEventListener("mousedown", (event) => {

        if(event.button !== 0){
         return;
         }

        draggedItem = item;

        dragStartPosition = {
          x: event.clientX,
          y: event.clientY
        };

        isDragging = false;

      });

      parentElement.appendChild(cardRow);

      return;
    }

    const folderContainer = document.createElement("div");

    const folderRow = document.createElement("div");
    item.row = folderRow;

    folderRow.className = "folder-item";
    folderRow.style.paddingLeft = `${10 + level * 20}px`;

    const toggleButton = document.createElement("button");

    toggleButton.type = "button";
    toggleButton.style.width = "24px";
    toggleButton.style.marginRight = "6px";
    toggleButton.style.padding = "0";
    toggleButton.style.background = "transparent";
    toggleButton.style.border = "none";
    toggleButton.style.color = "white";
    toggleButton.style.cursor = "pointer";

    const folderName = document.createElement("span");
    folderName.textContent = item.name;

    const childrenContainer = document.createElement("div");

    console.log(item);
    const hasChildren = item.children.length > 0;

    function handleToggleButtonMouseDown(event) {
      event.stopPropagation();
    }

    function handleToggleButtonClick(event) {
      event.stopPropagation();

      const childrenAreHidden =
        childrenContainer.classList.toggle("hidden");

      toggleButton.textContent = childrenAreHidden ? "+" : "-";
    }

    if (hasChildren) {

      toggleButton.textContent = "+";
      childrenContainer.classList.add("hidden");

      toggleButton.addEventListener(
        "mousedown",
        handleToggleButtonMouseDown
      );

      toggleButton.addEventListener(
        "click",
        handleToggleButtonClick
      );

    } else {

      toggleButton.style.visibility = "hidden";

    }

    folderRow.appendChild(toggleButton);
    folderRow.appendChild(folderName);

    folderRow.addEventListener("click", () => {

      document
        .querySelectorAll(".folder-item")
        .forEach(element => element.classList.remove("selected"));

      folderRow.classList.add("selected");

      selectedItem = item;

      selectedFolderName.textContent = item.name;

      document
        .getElementById("selected-folder-header")
        .classList.remove("hidden");

      deleteFolderButton.classList.remove("hidden");
      renameFolderButton.classList.remove("hidden");

      cardView.contentWindow.postMessage(
        {
          type: "folder-selected",
          name: item.name,
          path: item.path,
          projectPath
        },
        "*"
      );

    // end of function
    });

    function handleFolderMouseDown(event) {

      if (event.button !== 0) {
        return;
      }

      draggedItem = item;

      dragStartPosition = {
        x: event.clientX,
        y: event.clientY
      };

      isDragging = false;

    }

    folderRow.addEventListener(
      "mousedown",
      handleFolderMouseDown
    );

    folderRow.addEventListener("mousemove", () => {

      if (!isDragging) {
        return;
      }

      if (item === draggedItem) {
        targetFolder = null;
        return;
      }

      targetFolder = item;

      folderTreePanel.classList.remove("project-drop-target");

      document.querySelectorAll(".folder-item").forEach(element => {
        element.classList.remove("drop-target");
      });

      folderRow.classList.add("drop-target");

    });

    folderRow.addEventListener("mouseleave", () => {

      if (targetFolder === item) {
        targetFolder = null;
      }

      folderRow.classList.remove("drop-target");

    });

    folderContainer.appendChild(folderRow);
    folderContainer.appendChild(childrenContainer);

    parentElement.appendChild(folderContainer);

    if (hasChildren) {

      displayItems(
        item.children,
        childrenContainer,
        level + 1
      );

    }

  });

}

await refreshFolderTree();

function handleDocumentMouseMove(event){


  if(!draggedItem || !dragStartPosition){
    return;
  }
  const horizontalDistance =
    Math.abs(event.clientX - dragStartPosition.x);

  const verticalDistance =
    Math.abs(event.clientY - dragStartPosition.y);

  if(!isDragging){

    if(horizontalDistance < 5 && verticalDistance < 5){
      return;
    }

    isDragging = true;

    dragGhost.textContent = draggedItem.name;
    dragGhost.classList.remove("hidden");

  }

  dragGhost.style.left = `${event.clientX}px`;
  dragGhost.style.top = `${event.clientY}px`;

}

document.addEventListener(
  "mousemove",
  handleDocumentMouseMove
);

async function handleDocumentMouseUp(){

  if(isDragging && draggedItem){

    const destination = targetFolder
      ? targetFolder.path
      : projectPath;

    if(destination !== draggedItem.path){
      
      if(draggedItem.type === "folder"){
        await window.electronAPI.moveFolder(
        draggedItem.path,
        destination
        );
      } else if(draggedItem.type === "card") {
        await window.electronAPI.moveCard(
          draggedItem.path,
          destination
        );
      }

      await refreshFolderTree();

    }

  }

  document.querySelectorAll(".folder-item").forEach(item => {
    item.classList.remove("drop-target");
  });

  folderTreePanel.classList.remove("project-drop-target");

  isDragging = false;
  draggedItem = null;
  targetFolder = null;
  dragStartPosition = null;

  dragGhost.classList.add("hidden");

}

document.addEventListener(
  "mouseup",
  handleDocumentMouseUp
);

document.addEventListener("click", (event) => {
  
  if(contextMenu.contains(event.target)){
    return;
  }

  contextMenu.classList.add("hidden");
});

createFolderButton.addEventListener("click", async () => {

  const folderName = newFolderName.value.trim();

  if (folderName === ""){
      return;
  }
  
  const parentPath = selectedItem === null 
  ? projectPath
  : selectedItem.path;

  const result = await window.electronAPI.createFolder(
    parentPath,
    folderName
  );

  if (!result.success) {
    alert(result.message);
    return;
  };

  await refreshFolderTree();

});

createFileButton.addEventListener("click", async () => {

  const cardName = newFolderName.value.trim();

  if (cardName === "") {
     return;
  }

  let destinationFolder = projectPath;

  if(selectedItem !== null && selectedItem.type === "folder")
  {
     destinationFolder = selectedItem.path;
  }

  const result = await window.electronAPI.createCard(destinationFolder, cardName);

  if(!result.success) {
    alert(result.message);
    return;
  }

  contextMenu.classList.add("hidden");

  newFolderName.value = "";

  await refreshFolderTree(); 

})

renameFolderButton.addEventListener("click", async () => {

  if(selectedItem === null){
    return;
  }

  const newName = newFolderName.value.trim();

  if(newName == ""){
    return;
  }

  const result = await window.electronAPI.renameFolder(
     selectedItem.path,
     newName, 
  );

  if(!result.success){
    alert(result.message);
    return;
  }

  await refreshFolderTree;

});

deleteFolderButton.addEventListener("click", async () => {
  
  if(selectedItem === null){
    return;
  }

  const confirmed = confirm(`Delete folder "${selectedItem.name}"?`);

  if(!confirmed){
    return;
  }

  const result = await window.electronAPI.deleteFolder(
    projectPath,
    selectedItem.path
  );
 
  if(!result.success){
    alert(result.message);
    return;
  }

  selectedFolderName.textContent ="";
  deleteFolderButton.classList.add("hidden");
  selectedItem = null;

  await refreshFolderTree();

});

async function refreshFolderTree() {

  folders = await window.electronAPI.getProjectFolders(projectPath);

  console.log(folders);
  console.log("test refresh folder");

  tree.innerHTML = "";

  displayItems(folders);
}

export {
  folderTreePanel,
  selectedItem,
  refreshFolderTree,
  clearSelection
};
