const { app } = require("electron");
const crypto = require("crypto");
const fs = require("fs/promises");
const path = require ("path");

function getProjectItemsDataFile(projectPath) {

  const projectId = crypto
   .createHash("sha256")
   .update(projectPath)
   .digest("hex");

  return path.join(
    app.getPath("appData"),
     "Magic_Node",
     "Projects",
     projectId,
     "itemsData.json"
  );
}

async function initializeProjectItemsData(projectPath) {

  const itemsDataFile = getProjectItemsDataFile(projectPath);

  await fs.mkdir(
    path.dirname(itemsDataFile),{
      recursive: true
    }
  );

  try {
    await fs.access(itemsDataFile);
  } catch {
    await fs.writeFile(
      itemsDataFile,
      JSON.stringify([], null, 2),
      "utf-8"
    );
  }

}

async function getItems(projectPath) {
  
  const itemsDataFile = getProjectItemsDataFile(projectPath);

  try {

    const content = await fs.readFile(
      itemsDataFile,
      "utf-8"
    );

    return JSON.parse(content);
  } catch {
    return [];
  }
}

async function registerItem(projectPath, itemPath, type) {

  const items = await getItems(projectPath);

  const existingItem = items.find(item => item.path === itemPath);

  if (existingItem) {
    return existingItem;
  }
  
  const item = {
    id: crypto.randomUUID(),
    type,
    name: path.basename(itemPath),
    projectPath,
    path: itemPath
  };

  items.push(item);

  await fs.writeFile(getProjectItemsDataFile(projectPath),
  JSON.stringify(items, null, 2),
  "utf-8");

  return item;
}

async function deleteItem(projectPath, itemPath) {

  const items = await getItems(projectPath);

  const updatedItems = items.filter(
    item => item.path !== itemPath
  );

  await fs.writeFile(getProjectItemsDataFile(projectPath),
    JSON.stringify(updatedItems, null, 2),
    "utf-8");
}

async function updateItemPath(projectPath, oldPath, newPath){
    
  const items = await getItems(projectPath);

  const item = items.find(item => item.path === oldPath);

  if (!item) {
    return;
  }

  item.path = newPath;

  await fs.writeFile(getProjectItemsDataFile(projectPath),
    JSON.stringify(items, null, 2),
    "utf-8");

}

module.exports = {
  initializeProjectItemsData,
  registerItem,
  deleteItem,
  updateItemPath,
  getItems
};
