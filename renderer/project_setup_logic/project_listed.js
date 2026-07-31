export async function initializeProjectList() {

  const projectList = await window.electronAPI.getProjectList();

  const container = document.getElementById("project-list");
  const newProjectButton = document.getElementById("new-project");
  const openProjectButton = document.getElementById("open-project");
  const deleteProjectButton = document.getElementById("delete-project");


  container.innerHTML = "";

  let selectedProject = null;

  projectList.forEach(project => {

    const card = document.createElement("div");

    card.className = "project-card";

    card.addEventListener("click", () => {

      document.querySelectorAll(".project-card").forEach(c => c.classList.remove("selected"));

      card.classList.add("selected");
      selectedProject = project;

    })

    card.innerHTML = `
      <div class="project-name">
      ${project.projectName}
      </div>

      <div class="project-path">
        ${project.parentFolder}
      </div>
    `;

    container.appendChild(card);

  });

  newProjectButton.onclick = () => {

    document.getElementById("new-project-modal").classList.remove("hidden");
  };
  
  document.getElementById("browse-new-project-folder").onclick = async () => {

    const folder = await window.electronAPI.selectFolder();

    if(!folder){
      return;
    }

    document.getElementById("new-project-folder").value = folder;

  };

  document.getElementById("cancel-new-project").onclick = () => {
    
    document.getElementById("new-project-modal").classList.add("hidden");
    document.getElementById("new-project-name").value = "";
    document.getElementById("new-project-folder").value = "";

  };


  document.getElementById("confirm-new-project").onclick = async () => {

    const projectName = document.getElementById("new-project-name").value.trim();

    const parentFolder = document.getElementById("new-project-folder").value;

    if(projectName === "" || parentFolder === "") {
        return;
    }

    const result = await window.electronAPI.createProject(
      parentFolder,
      projectName
    );

    if (!result.success) {
      alert(result.message);
      return;
    }

    document.getElementById("new-project-modal").classList.add("hidden");
    document.getElementById("new-project-name").value = "";
    document.getElementById("new-project-folder").value ="";

    await initializeProjectList();

  };

  deleteProjectButton.onclick = async () => {

    if (!selectedProject) {
      return;
    }

    const confirmed = confirm(`Delete project "${selectedProject.projectName}" ?`);

    if(!confirmed) {
      return;
    }

    const result = await window.electronAPI.deleteProject(
      selectedProject.parentFolder,
      selectedProject.projectName
    );

    if (!result.success){
      alert(result.message);
      return;
    }

    selectedProject = null;

    await initializeProjectList();

  };

  openProjectButton.onclick = async () => {

    if(!selectedProject){
      return;
    }

    const projectPath = encodeURIComponent(
      `${selectedProject.parentFolder}\\${selectedProject.projectName}`
    );

    window.location.href=`./project_window/project_window.html?path=${projectPath}`;

  };


}

