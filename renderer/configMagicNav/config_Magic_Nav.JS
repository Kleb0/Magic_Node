import magicNav from "../../module/Magic_Nav/magic_nav_main.js"; 

function registerViews() {
  
  magicNav.registerView("card-classor", {
    path: "card_view/card_classor.html"
  });

  magicNav.registerView("big-card", {
    path: "card_view/big_card.html"
  });

  magicNav.registerView("wiki", {
    path: "../Wiki_page/wiki_view.html"
  });

}

function registerHierarchy() {

  magicNav.setHierarchy("project-window", {
  
    children: [
      "card-classor"
    ]

  });

  magicNav.setHierarchy("card-classor", {
    
    parent: "project-window",

    children: [
      "big-card",
      "wiki"
    ]

  });

  magicNav.setHierarchy("big-card", {

    parent: "card-classor"

  });

  magicNav.setHierarchy("wiki", {

    parent: "card-classor"

  });

}

function configureMagicNav() {

  registerViews();

  registerHierarchy();

}

export { configureMagicNav};
