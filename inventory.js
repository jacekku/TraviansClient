showPanel = false;
currentPanel = "inventory";
panelList = {};
ITEMS = [];

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
  thisPlayer.inventory = inventory;

  if (currentPanel === "inventory") showInventory();
  if (currentPanel === "crafting") showPossibleCrafting();
}

function showInventory() {
  const itemsElement = inventoryElement.children[1].children;

  thisPlayer.inventory.items.forEach((item, index) => {
    if (item) {
      itemsElement[index].children[0].src = getItemPath(
        ITEMS.find((i) => i.name === item.name).name
      );
      itemsElement[index].children[1].innerHTML = item.stackSize;
    } else {
      itemsElement[index].children[0].src = "assets/blank.png";
      itemsElement[index].children[1].innerHTML = "";
    }
  });
}

window.addEventListener("load", (e) => {
  inventoryButton = document.querySelector(".inventory-toggle");
  craftingButton = document.querySelector(".crafting-toggle");
  buildingButton = document.querySelector(".building-toggle");
  inventoryElement = document.querySelector(".inventory");
  craftingElement = document.querySelector(".crafting");
  buildingElement = document.querySelector(".building");

  panelList = {
    inventory: {
      element: inventoryElement,
      button: inventoryButton,
      callback: showInventory,
    },
    crafting: {
      button: craftingButton,
      element: craftingElement,
      callback: showPossibleCrafting,
    },
    building: {
      button: buildingButton,
      element: buildingElement,
    },
  };
  Object.keys(panelList).forEach((key) => {
    panelList[key].button.addEventListener("click", (_) => {
      togglePanel(key);
    });
  });
});

function togglePanel(panel) {
  if (panel === currentPanel) {
    showPanel = !showPanel;
  } else {
    showPanel = true;
  }
  currentPanel = panel;
  Object.values(panelList).forEach(
    (value) => (value.element.style.visibility = "hidden")
  );
  panelList[currentPanel].element.style.visibility = showPanel
    ? "visible"
    : "hidden";
  if (panelList[currentPanel].callback) panelList[currentPanel].callback();
}

function showPossibleCrafting() {
  if (currentPanel !== "crafting") return;
  const collapsedInventory = collapseInventory(thisPlayer.inventory);
  const craftableItems = ITEMS.filter((item) => item.craftable)
    .map((item) => item.craftable)
    .filter((craftable) =>
      inventoryHasAllSourceItems(collapsedInventory, craftable.sourceItems)
    );
  const craftingPossibilitiesElement = document.querySelector(
    ".crafting-possibilities"
  );
  craftingPossibilitiesElement.innerHTML = "";
  craftableItems.forEach((craftable) => {
    const craftPossibility = createDivElement("craft-possibility");
    const resultElement = createItemElement(craftable.result);
    resultElement.addEventListener("click", () => {
      craftItem(craftable.result);
    });
    craftPossibility.appendChild(resultElement);
    craftPossibility.appendChild(createArrowElement());
    craftable.sourceItems.forEach((itemName) =>
      craftPossibility.appendChild(createItemElement(itemName))
    );

    craftingPossibilitiesElement.appendChild(craftPossibility);
  });
}

function createDivElement(...classes) {
  const el = document.createElement("div");
  el.classList.add(...classes);
  return el;
}

function createItemElement(itemName) {
  const el = createDivElement("item");
  const img = document.createElement("img");
  img.src = getItemPath(itemName);
  el.appendChild(img);
  return el;
}
function createArrowElement() {
  const el = createDivElement("item");
  const img = document.createElement("img");
  img.src = "assets/craft_arrow.png";
  el.appendChild(img);
  return el;
}

function collapseInventory(inventory) {
  const items = inventory.items;
  const collapsed = {};
  items.filter(Boolean).forEach((item) => {
    collapsed[item.name] = collapsed[item.name]
      ? (collapsed[item.name] += item.stackSize)
      : item.stackSize;
  });
  return collapsed;
}

function inventoryHasAllSourceItems(collapsedInventory, sourceItems) {
  return (
    sourceItems.length ===
    sourceItems.map((item) => collapsedInventory[item]).filter(Boolean).length
  );
}
