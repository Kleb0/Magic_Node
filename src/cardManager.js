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

async function getCards(folderPath) {
  
  const entries = await fs.readdir(folderPath, {
    withFileTypes: true
  });

  return entries
    .filter(entry => entry.isFile())
    .filter(entry => path.extname(entry.name) === ".json")
    .map(entry => ({

      name: path.basename(entry.name, ".json"),
      path: path.join(folderPath, entry.name),

    }));

}


module.exports = {
    createCard,
    renameCard,
    deleteCard,
    moveCard,
    getCards
};


