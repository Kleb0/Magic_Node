const fs = require("fs/promises");
const path = require("path");

async function createCard(folderPath, cardName){

  const filePath = path.join(folderPath, `${cardName}.json`);

  const card = {

    name: cardName,
    type: "card",
    content: "",
    metadata: {
      imagePath:null
    },
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

async function getCards(folderPath, projectPath) {
  
  const entries = await fs.readdir(folderPath, {
    withFileTypes: true
  });

  const cards = [];
  
  for (const entry of entries){
    if (!entry.isFile() || path.extname(entry.name) !== ".json"){
      continue;
    }

    const cardPath = path.join(folderPath, entry.name);

    const content = await fs.readFile(cardPath, "utf-8");

    const card = JSON.parse(content);

    let imagePath = null;

    if (card.metadata.imagePath) {
      imagePath = path.join(projectPath, card.metadata.imagePath);
    }

    cards.push({
      name: card.name,
      path: cardPath,
      type: card.type,
      content: card.content,
      metadata: card.metadata,
      links: card.links,
      imagePath
    });
  }
  
  return cards;

}

async function setCardImage(cardPath, projectPath, imagePath) {

  const relativeImagePath = path.relative(
    projectPath,
    imagePath
  );

  if (relativeImagePath.startsWith("..") || path.isAbsolute(relativeImagePath)) {
    throw new Error(
      "Image must be inside inside the project."
    );
  }

  const content = await fs.readFile(cardPath, "utf-8");

  const card = JSON.parse(content);

  card.metadata.imagePath = relativeImagePath;

  await fs.writeFile(cardPath, JSON.stringify(card, null, 2), "utf-8");

  return relativeImagePath; 
  
}


module.exports = {
    createCard,
    renameCard,
    deleteCard,
    moveCard,
    setCardImage,
    getCards
};


