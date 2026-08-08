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

  const itemName = type === "card" ? path.basename(itemPath, path.extname(itemPath)) : path.basename(itemPath);
  
  const item = {
    id: crypto.randomUUID(),
    type,
    name: itemName,
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

  const updatedItems = items.filter( item => {

    const relativePath = path.relative(itemPath, item.path);

    const isCurrentItem = relativePath === "";

    const isChildItem = relativePath !== "" && !relativePath.startsWith("..") && !path.isAbsolute(relativePath);
    
    return !isCurrentItem && !isChildItem;

  });

  await fs.writeFile(getProjectItemsDataFile(projectPath),
    JSON.stringify(updatedItems, null, 2),
    "utf-8");
}

async function updateItemPath(projectPath, oldPath, newPath){
    
  const items = await getItems(projectPath);

  let itemFound = false;

  for (const item of items) {

    const relativePath = path.relative(oldPath, item.path);
  
    const isCurrentItem = relativePath === "";

    const isChildItem = relativePath !== "" && !relativePath.startsWith("..") && !path.isAbsolute(relativePath);

    if(!isCurrentItem && !isChildItem) {continue;}
 
    itemFound = true;

    item.path = isCurrentItem ? newPath : path.join(newPath, relativePath);

    item.name = item.type === "card" ? path.basename(item.path, path.extname(item.path)) : path.basename(item.path);
  
  }

  if(!itemFound) {return;}

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
