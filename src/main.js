const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const { pathToFileURL } = require("url");
const projectManager = require("./projectManager.js");
const cardManager = require("./cardManager.js");

const fs = require("fs/promises");
const path = require("path");

function createWindow() {
  const window = new BrowserWindow({
    width : 1280,
    height : 720,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  });

  window.loadFile(path.join(__dirname, "../renderer/index.html"));
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", ()=> {

    if(BrowserWindow.getAllWindows().length == 0 ){
      createWindow();
    }
      
  });
});

app.on("window-all-closed", ()=> {
  if (process.platform !== "darwin") {
    app.quit();
  }
});


ipcMain.handle("select-folder", async () => {

  const result = await dialog.showOpenDialog({
    properties: ["openDirectory"]
  });

  if (result.canceled){
    return null;
  }

  return result.filePaths[0];
})

ipcMain.handle("create-project", async (event, parentFolder, projectName) => { 

  try {

    const projectPath = await projectManager.createProject(
      parentFolder,
      projectName
    );

    return {
      success:true,
      projectPath
    };

  } catch (error){

    console.error(error);

      return {
        success: false,
        message: error.message
      };
    }
  

});

ipcMain.handle("has-projects", async () => {

  return await projectManager.hasProjects();

})

ipcMain.handle("get-project-list", async () => {

  return await projectManager.getProjectList();

});

ipcMain.handle(
  "get-project-folders",
  async (event, projectPath) => {
    return await projectManager.getProjectFolders(
      projectPath
    );
  }
);

ipcMain.handle(
  "delete-project",
  async (event, parentFolder, projectName) => {
    try {
      await projectManager.deleteProject(
        parentFolder,
        projectName
      );
      return {
        success:true
      };
    } catch (error) {
      console.error(error);

      return {
        success: false,
        message: error.message
      };
    }
  }  
);

ipcMain.handle("create-folder", async (event, projectPath, folderName) => {

  try{
    await fs.mkdir(path.join(projectPath, folderName));

    return {
      success:true
    };
  } catch(error){
    return {
      success:false,
      message:error.message
    };
  } 


});

ipcMain.handle(  "delete-folder", async (event, projectPath, folderName) => {

  try{

    await projectManager.deleteFolder(
      folderName
    );

    return{
    success:true
    };
  } catch(error) {
      return{
      success:false,
      message:error.message
    };
  }
});

ipcMain.handle("rename-folder", async (event, folderPath, newFolderName) => {

    try{
    await projectManager.renameFolder(
        folderPath,
        newFolderName
    );

    return {
      success:true
    };
    
  } catch (error) {
    return{
      success:false,
      message:error.message
    };
  }

});

ipcMain.handle("move-folder", async(event, sourcePath, targetPath) => {
  
   try{
    await projectManager.moveFolder(sourcePath, 
      targetPath
   );

    return {
     success:true
    };
  } catch (error){
    return{
      success:false,
      message:error.message
    };
  }
});

ipcMain.handle("create-card", async(event, folderPath, cardName) => {

  try{
    
    const cardPath = 
      await cardManager.createCard(
        folderPath, cardName
      );

    return{
      success:true,
      cardPath
    };

  } catch(error){

    return{
      success:false,
      message:error.message
    };
  }
});

ipcMain.handle("rename-card", async (event, cardPath, newCardName) => {

  try{
    await cardManager.renameCard(cardPath, newCardName);
  
    return{
      success:true
    };
  } catch(error){
    return{
      success:false,
      message:error.message
    };
  }
});

ipcMain.handle("delete-card", async (event, cardPath) => {

  try{

    await cardManager.deleteCard(cardPath);

    return {
      success: true
    };

  } catch (error){
    return {
      success : false,
      message : error.message
    };
  }

});

ipcMain.handle("move-card", async (event, cardPath, targetFolderPath) => {

  try{

    await cardManager.moveCard(cardPath, targetFolderPath);

    return{
      success:true
    };

  } 
    catch (error) {
    return {
      success : false,
      message : error.message
    }
  }

});

ipcMain.handle("get-folder-cards", async (event, folderPath, projectPath) => {

  try {
    const cards = await cardManager.getCards(folderPath, projectPath);

    const formattedCards = cards.map(card => ({

      ...card,

      imageUrl: card.imagePath ? pathToFileURL(card.imagePath).href : null


    }));

    return {
      success: true,
      cards: formattedCards
    };
  } catch (error) {
      return {
        success: false,
        message: error.message
    };
  }
 }
);

ipcMain.handle("select-card-image", async (event, cardPath, projectPath) => {

  try {
    const result = await dialog.showOpenDialog({

      title: "Select image",
      defaultPath : projectPath,

      properties: [
        "openFile"
      ],

      filters:[
        {
          name:"Images",
          extensions:[
            "png",
            "jpg",
            "jpeg",
            "webp",
            "gif",
            "bmp"
          ]
        }
      ]
    });

    if (result.canceled) {
      return {
        success:true,
        canceled:true
      };
    }
    const imagePath = result.filePaths[0];

    const relativeImagePath = await cardManager.setCardImage(
      cardPath,
      projectPath,
      imagePath
    );

    return {
      success: true,
      canceled: false,
      imageUrl: pathToFileURL(imagePath).href,
      relativeImagePath
    };
      // end of try section
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }


});
