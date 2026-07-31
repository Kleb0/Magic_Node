const fs = require("fs/promises");
const path = require("path");

async function createCard(folderPath, cardName){

  const filePath = path.join(folderPath, `${cardName}.json`);

  const card = {

    name: cardName,
    type: "card",
    content: "",
    metadata: {},
    links : []
  }

  await fs.writeFile(filePath, JSON.stringify(card, null, 2), "UTF-8");

  return filePath;
};

async function renameCard(cardPath, newCardName) {

  const parentFolder = path.dirname(cardPath);

  const newPath = path.join(parentFolder, `${newCardName}.json`);

  await fs.rename(cardPath, newPath);

}

async function deleteCard(cardPath) {
  
  await fs.rm(cardPath, {force:true });
}

async function moveCard(cardPath, targetFolderPath) {
  
  const fileName = path.basename(cardPath);

  const newCardPath = path.join(targetFolderPath, fileName);

  await fs.rename(cardPath, newCardPath);

}


module.exports = {
    createCard,
    renameCard,
    deleteCard,
    moveCard
};


