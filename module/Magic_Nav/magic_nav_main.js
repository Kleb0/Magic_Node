class MagicNav {

  constructor(){
    this.views = new Map();

    this.currentView = null;

  }

  registerView(viewId, config){

    if (this.views.has(viewId)) {
      throw new Error(`Magic_Nav : View "${viewId}" has already been registered. `);
    }
    this.views.set(viewId, config);
  }

  getView(viewsId) {
    return this.views.get(viewId);
  }

  hasView(viewId){
    return this.views.has(viewId);
  }

  getCurrentView() {
    return this.currentView;
  }

  getCurrentView(viewsId) {
    this.currentView = viewId;
  }

  // end of class
}

const magicNav = new MagicNav();

export default magicNav;
