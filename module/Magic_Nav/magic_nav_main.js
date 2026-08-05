import hierarchy from "./hierarchy.js";

class MagicNav {

  constructor(){
    
    if(MagicNav.instance) {
      return MagicNav.instance;
    }

    this.views = new Map();

    this.currentView = null;

    MagicNav.instance = this; 


  }

  initialize(container) {

    this.container = container;

  }

  openView(viewId){
    
    const view = this.getView(viewId);

    if(!view) {
      throw new Error(`Magic_Nav : Unknown view "${viewId}". `);
    }
    
    this.container.src = view.path;
    this.currentView = viewId;
  }

  registerView(viewId, config){

    if (this.views.has(viewId)) {
      throw new Error(`Magic_Nav : View "${viewId}" has already been registered. `);
    }
    this.views.set(viewId, config);
  }

  getView(viewId) {
    return this.views.get(viewId);
  }

  hasView(viewId){
    return this.views.has(viewId);
  }

  getCurrentView() {
    return this.currentView;
  }

  setCurrentView(viewId) {
    this.currentView = viewId;
  }

  setHierarchy(viewId, config) {
    hierarchy.setHierarchy(viewId, config);
  }

  getParent(viewId){
    return hierarchy.getParent(viewId);
  }

  getChildren(viewId){
    return hierarchy.getChildren(viewId);
  }

  // end of class
}

const magicNav = new MagicNav();

export default magicNav;
