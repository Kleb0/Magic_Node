class NavigationStore  {

  constructor () {
    this.htmlAddresses = {};

  }

  registerHtmlAddresses(htmlPath) {
    
    const fileName = htmlPath
      .split(/[\\/]/)
      .pop()
      .replace(/\.html$/i, "");

    if(this.htmlAddresses[fileName]) {
      throw new Error(`Navigation Store : "${fileName}.html" has already been registered`); 
    }
    this.htmlAddresses[fileName] = htmlPath;
  }

  getHtmlAddresses() {
    return this.htmlAddresses;
  }

  getHtmlAddress(viewName) {
    return this.htmlAddresses[viewName];
  }

}

module.exports = new NavigationStore();
