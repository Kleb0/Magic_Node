const magicNavMessages = {
    
  openWiki(card) {

    return {
      type:"open-wiki",
      card
    };
  },

  openBigCard(card) {

    return {
      type: "open-big-card",
      card
    };
  },

  closeWiki() {
    return {
      type: "close-wiki"
    };
  },

  displayCard(card) {
    return {
      type: "display-card",
      card
    }
  },

  folderSelected(name, path, projectPath){
    return {
      type: "folder-selected",
      name,
      path,
      projectPath
    };    
  },

  cardImageSelected(imageUrl) {
    return {
      type: "card-image-selected",
      imageUrl
    };
  }

};

export default magicNavMessages;
