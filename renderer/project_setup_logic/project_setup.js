import { initializeProjectList } from "./project_listed.js"


async function loadProjectSetupBoard() {

  const board = document.getElementById("board");

  const hasProjects = await window.electronAPI.hasProjects();

  const htmlFile = hasProjects 
  ? "project_setup_logic/project_listed.html"
  : "project_setup_logic/project_setup_board.html";

  const cssFile = hasProjects
  ? "project_setup_logic/project_listed.css"
  : "project_setup_logic/project_setup_board.css";

  const html = await fetch(htmlFile);

  board.innerHTML = await html.text();

  const css = document.createElement("link");

  css.rel = "stylesheet";
  css.href = cssFile;

  
  document.head.appendChild(css);

  if(hasProjects){
    initializeProjectList();
  }  else {
    initializeProjectSetup();
  }
}

function initializeProjectSetup() {

  const browseButton = document.getElementById("browse-folder");

  const createButton = document.getElementById("create-project");

  browseButton.addEventListener("click", async () => {

    const folder = await window.electronAPI.selectFolder();

    if(!folder){
      return;
    }
    
      document.getElementById("project-folder").value = folder;

  });

  createButton.addEventListener("click", async () => {

    const projectName =
      document.getElementById("project-name").value.trim();

    const parentFolder =
      document.getElementById("project-folder").value;

    if(projectName === ""|| parentFolder === ""){
      return;
    }

    await window.electronAPI.createProject(
      parentFolder,
      projectName
    );
  
  });
}

window.addEventListener("DOMContentLoaded", () => {

  loadProjectSetupBoard();
});
