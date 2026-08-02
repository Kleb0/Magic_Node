const { contextBridge, ipcRenderer  } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {

    selectFolder: () => ipcRenderer.invoke("select-folder"),
 
    createProject: (parentFolder, projectName) => ipcRenderer.invoke("create-project", parentFolder, projectName),

    deleteProject : (parentFolder, projectName) => ipcRenderer.invoke("delete-project", parentFolder, projectName),

    hasProjects: () => ipcRenderer.invoke("has-projects"),

    getProjectList: () => ipcRenderer.invoke("get-project-list"),

    getProjectFolders: (projectPath) => ipcRenderer.invoke("get-project-folders", projectPath),

    createFolder : (projectPath, folderName) => ipcRenderer.invoke("create-folder", projectPath, folderName),

    renameFolder : (folderPath, newFolderName) => ipcRenderer.invoke("rename-folder", folderPath, newFolderName),

    deleteFolder : (projectPath, folderName) => ipcRenderer.invoke("delete-folder", projectPath, folderName),

    moveFolder : (sourcePath, targetPath) => ipcRenderer.invoke("move-folder", sourcePath, targetPath),

    createCard : (folderPath, cardName) => ipcRenderer.invoke("create-card", folderPath, cardName),

    renameCard : (cardPath, newCardName) => ipcRenderer.invoke("rename-card", cardPath, newCardName),

    deleteCard : (cardPath) => ipcRenderer.invoke("delete-card", cardPath),

    moveCard : (cardPath, targetFolderPath) => ipcRenderer.invoke("move-card", cardPath, targetFolderPath),

    getFolderCards: (folderPath, projectPath) => ipcRenderer.invoke("get-folder-cards", folderPath, projectPath),

    selectCardImage: (cardPath, projectPath) => ipcRenderer.invoke("select-card-image", cardPath, projectPath),

});


