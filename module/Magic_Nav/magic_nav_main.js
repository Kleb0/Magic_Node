import hierarchy from "./magic_nav_hierarchy.js";
import * as messageOperator from "./magic_nav_message_operator.js";

class MagicNav {

  constructor(){
    
    if(MagicNav.instance) {
      return MagicNav.instance;
    }

    this.views = new Map();

    this.currentView = null;
    
    this.isConfigured = false;

    this.messages = messageOperator;

    MagicNav.instance = this; 


  }

  initialize(container) {

    this.container = container;

  }

  configure(configurationFunction) {
    if(typeof configurationFunction !== "function"){
      throw new Error(
        "Magic_Nav : configure() expects a configuration function"
      );
    }

    configurationFunction();

    this.isConfigured = true;

  }

  openView(viewId){

    if(!this.isConfigured) {
      throw new Error(
        "Magic_Nav : configureMagicNav() must be called before using Magic_Nav"
      );
    }
    
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
