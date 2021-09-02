showInventory = true;

ITEMS = [
  {
    id: 0,
    maxStackSize: 100,
    name: "wood",
  },
  {
    id: 1,
    maxStackSize: 100,
    name: "meat",
  },
  {
    id: 2,
    maxStackSize: 100,
    name: "copper_ore",
  },
  {
    id: 3,
    maxStackSize: 100,
    name: "iron_ore",
  },
  {
    id: 4,
    maxStackSize: 100,
    name: "gold_ore",
  },
  {
    id: 5,
    maxStackSize: 100,
    name: "copper_bar",
    craftable: true,
    sourceItems: ["copper_ore", "wood"],
    facility: ["inventory-craft"],
  },
  {
    id: 6,
    maxStackSize: 100,
    name: "iron_bar",
    craftable: true,
    sourceItems: ["iron_ore", "wood"],
    facility: ["inventory-craft"],
  },
  {
    id: 7,
    maxStackSize: 100,
    name: "gold_bar",
    craftable: true,
    sourceItems: ["gold_ore", "wood"],
    facility: ["inventory-craft"],
  },
  {
    id: 8,
    maxStackSize: 100,
    name: "cooked_meat",
    craftable: true,
    sourceItems: ["meat", "wood"],
    facility: ["inventory-craft"],
  },
];

function sendCommand(command, block) {
  switch (command) {
    case "CHOP WOOD":
      socket.emit("items:add", {
        player: thisPlayer,
        item: ITEMS.find((i) => i.name === "wood"),
      });
      break;
    case "FISH":
    case "HUNT":
      socket.emit("items:add", {
        player: thisPlayer,
        item: ITEMS.find((i) => i.name === "meat"),
      });
      break;
    case "MINE":
      ore = ITEMS.find(
        (i) =>
          i.name ===
          MATERIAL_RICHNESS[block.materialRichness].toLowerCase() + "_ore"
      );
      if (ore)
        socket.emit("items:add", {
          player: thisPlayer,
          item: ore,
        });
      break;
  }
}

function craftItem(itemName) {
  const itemDefinition = ITEMS.find((i) => i.name === itemName);

  socket.emit("items:craft", {
    player: thisPlayer,
    itemToCraft: itemDefinition,
  });
}

function getItemPath(itemName) {
  return "assets/items/" + itemName + ".png" || "assets/knight.png";
}

function updateInventory(inventory) {
  console.log(inventory);
  const itemsElement = inventoryElement.children[1].children;
  inventory.items.forEach((item, index) => {
    if (item) {
      itemsElement[index].children[0].src = getItemPath(
        ITEMS.find((i) => i.id === item.id).name
      );
    } else {
      itemsElement[index].children[0].src = "assets/blank.png";
    }
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
