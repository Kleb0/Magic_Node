import magicNav from "../../module/Magic_Nav/magic_nav_main.js"; 

function registerView() {
  
  magicNav.registerView("card-classor", {
    path: "card_view/card_classor.html"
  });

  magicNav.registerView("big-card", {
    path: "card_view/big_card.html"
  });

  magicNav.registerView("card-classor", {
    path: "../Wiki_page/wiki_view.html"
  });

}

function registerHierarchy() {

}

function configureMagicNav() {

  registerView();

  registerHierarchy();

}

export { configureMagicNav};
