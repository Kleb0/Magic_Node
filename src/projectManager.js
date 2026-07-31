const { app } = require("electron");

const fs = require("fs/promises");
const path = require("path");

function getProjectListFile() {

    return path.join(
        app.getPath("appData"),
        "Magic_Node",
        "ProjectList",
        "projectList.json"
    );

}

async function registerProject(parentFolder, projectName) {

    const projectListFile = getProjectListFile();

    await fs.mkdir(
        path.dirname(projectListFile),
        {
            recursive: true
        }
    );

    let projectList = [];

    try {

        const fileContent = await fs.readFile(
            projectListFile,
            "utf-8"
        );

        projectList = JSON.parse(fileContent);

    } catch {

        projectList = [];

    }

    projectList.push({

        parentFolder,
        projectName

    });

    await fs.writeFile(
        projectListFile,
        JSON.stringify(projectList, null, 2),
        "utf-8"
    );

}

async function createProject(parentFolder, projectName) {

    const projectPath = path.join(
        parentFolder,
        projectName
    );

    await fs.mkdir(projectPath);

    await fs.mkdir(path.join(projectPath, "Maps"));
    await fs.mkdir(path.join(projectPath, "Characters"));
    await fs.mkdir(path.join(projectPath, "Creatures"));

    await registerProject(
        parentFolder,
        projectName
    );

    return projectPath;

}

async function hasProjects() {

    try {

        const fileContent = await fs.readFile(
            getProjectListFile(),
            "utf-8"
        );

        const projectList = JSON.parse(fileContent);

        return projectList.length > 0;

    } catch {

        return false;

    }

}

async function getProjectList() {

    try {

        const fileContent = await fs.readFile(
            getProjectListFile(),
            "utf-8"
        );

        return JSON.parse(fileContent);

    } catch {

        return [];

    }

}

async function getProjectFolders(projectPath) {

  const entries = await fs.readdir(
    projectPath,
    {
      withFileTypes: true
    }
  );

  const items = [];

  for(const entry of entries){

    const entryPath = path.join(projectPath, entry.name);


    if(entry.isDirectory()){

      const children = await getProjectFolders(entryPath);

      items.push({
        type: "folder",
        name: entry.name,
        path: entryPath, children
      });

      continue;

    }

    if (entry.isFile() && path.extname(entry.name).toLowerCase() === ".json"){
      
      items.push({
        type:"card",
        name: path.basename(entry.name, ".json"),
        path: entryPath
      });
    }

  }


  return items;
          
}

async function deleteProject(parentFolder, projectName) {
  
  const projectPath = path.join(parentFolder,projectName);

  await fs.rm(
    projectPath,
    {
      recursive: true,
      force: true
    }
  );

  const fileContent = await fs.readFile(
    getProjectListFile(),
    "utf-8"
  );

  const projectList = JSON.parse(fileContent);

  const updateProjectList = projectList.filter(project => {

    return !( project.parentFolder === parentFolder && project.projectName === projectName );
  });

  await fs.writeFile(
    getProjectListFile(),
    JSON.stringify(updateProjectList, null, 2),
    "utf-8"
  );

}

async function deleteFolder(folderPath) {

  await fs.rm(folderPath,{recursive: true, force: true});

}

async function renameFolder(folderPath, newFolderName) {

  const parentFolder = path.dirname(folderPath);

  const newPath = path.join(parentFolder, newFolderName);

  await fs.rename(folderPath, newPath);

}

async function moveFolder(sourcePath, targetFolder){
    
  const folderName = path.basename(sourcePath);

  const destination = path.join(targetFolder, folderName);

  await fs.rename(sourcePath, destination);
}

module.exports = {

    createProject,
    deleteProject,
    hasProjects,
    getProjectList,
    getProjectFolders,
    deleteFolder,
    renameFolder,
    moveFolder
};
