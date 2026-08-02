const title = document.getElementById("wiki-title");

const backButton = document.getElementById("back-button");

window.addEventListener("message", event => {

  if (event.data.type !== "display-card"){
    return;
  }

  title.textContent = event.data.card.name;

});

backButton.addEventListener("click", () => {

  window.parent.postMessage({
    type: "close-wiki"
  }, "*");
});
