showInventory = true;

ITEMS = [
  {
    id: 0,
    imgSource: "assets/items/wood.png",
    name: "wood",
  },
  {
    id: 1,
    imgSource: "assets/items/meat.png",
    name: "meat",
  },
  {
    id: 2,
    imgSource: "assets/items/copper_ore.png",
    name: "copper_ore",
  },
  {
    id: 3,
    imgSource: "assets/items/iron_ore.png",
    name: "iron_ore",
  },
  {
    id: 4,
    imgSource: "assets/items/gold_ore.png",
    name: "gold_ore",
  },
];

function sendCommand(command, block) {
  switch (command) {
    case "CHOP WOOD":
      socket.emit("items:add", {
        player: thisPlayer,
        item: { id: 0 },
      });
      break;
    case "FISH":
    case "HUNT":
      socket.emit("items:add", {
        player: thisPlayer,
        item: { id: 1 },
      });
      break;
    case "MINE":
      ore_id = ITEMS.find(
        (i) =>
          i.name ===
          MATERIAL_RICHNESS[block.materialRichness].toLowerCase() + "_ore"
      ).id;
      if (ore_id)
        socket.emit("items:add", {
          player: thisPlayer,
          item: { id: ore_id },
        });
      break;
  }
}

function updateInventory(inventory) {
  console.log(inventory);
  const itemsElement = inventoryElement.children[1].children;
  inventory.items.forEach((item, index) => {
    if (item)
      itemsElement[index].children[0].src = ITEMS.find(
        (i) => i.id === item.id
      ).imgSource;
    console.log(itemsElement[index].src);
  });
}

window.addEventListener("load", (e) => {
  inventoryButton = document.querySelector(".inventory-toggle");
  inventoryElement = document.querySelector(".inventory");

  inventoryButton.addEventListener("click", (_) => {
    showInventory = !showInventory;
    inventoryElement.style.visibility = showInventory ? "visible" : "hidden";
  });
});
