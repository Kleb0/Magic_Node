class Hierarchy {

  constructor () {
    this.views = new Map();
  }

  setHierarchy(viewId, config) {

     this.views.set(viewId, {
       parent: config.parent ?? null,
       children: config.children ?? []
    }); 
  }

  getHierarchy(viewId) {
    return this.views.get(viewId);
  }

  getParent(viewId) {
    const hierarchy = this.views.get(viewId);

    if(!hierarchy) {
      return null;
    }

    return hierarchy.parent;
  }

  getChildren(viewId) {
      const hierarchy = this.views.get(viewId);

    if(!hierarchy) {
      return [];
    }

    return hierarchy.children;
  }

}

const hierarchy = new Hierarchy();

export default hierarchy;
