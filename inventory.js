showInventory = true;

window.addEventListener("load", (e) => {
  inventoryButton = document.querySelector(".inventory-toggle");
  inventoryElement = document.querySelector(".inventory");

  inventoryButton.addEventListener("click", (_) => {
    showInventory = !showInventory;
    inventoryElement.style.visibility = showInventory ? "visible" : "hidden";
  });
});
