const { app } = require("electron");
const itemsData = require("../Data/items_datas.js");
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

    const mapsPath = path.join(projectPath,"Maps");
    const charactersPath = path.join(projectPath, "Characters");
    const creaturesPath = path.join(projectPath, "Creatures");

 
    await fs.mkdir(mapsPath);
    await fs.mkdir(charactersPath);
    await fs.mkdir(creaturesPath);

    await itemsData.initializeProjectItemsData(projectPath);

    await itemsData.registerItem(
      projectPath,
      mapsPath,
      "folder"
    );

    await itemsData.registerItem(
      projectPath,
      charactersPath,
      "folder"
    );

    await itemsData.registerItem(
      projectPath,
      creaturesPath,
      "folder"
    );

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

async function createFolder(projectPath, parentFolderPath, folderName) {
  
  const folderPath = path.join(
    parentFolderPath,
    folderName,
  );

  await fs.mkdir(folderPath);

  const item = await itemsData.registerItem(
    projectPath,
    folderPath,
    "folder"
  );

  return {
    folderPath,
    item
  };

}

async function deleteFolder(projectPath, folderPath) {

  await fs.rm(folderPath,{recursive: true, force: true});

  await itemsData.deleteItem(projectPath, folderPath);

}

async function renameFolder(projectPath, folderPath, newFolderName) {

  const parentFolder = path.dirname(folderPath);

  const newPath = path.join(parentFolder, newFolderName);

  await fs.rename(folderPath, newPath);

  await itemsData.updateItemPath(projectPath, folderPath, newPath);


}

async function moveFolder(projectPath, sourcePath, targetFolder){
    
  const folderName = path.basename(sourcePath);

  const destination = path.join(targetFolder, folderName);

  await fs.rename(sourcePath, destination);

  await itemsData.updateItemPath(projectPath, sourcePath, destination);
}

module.exports = {

    createProject,
    deleteProject,
    hasProjects,
    getProjectList,
    getProjectFolders,
    createFolder,
    deleteFolder,
    renameFolder,
    moveFolder
};
