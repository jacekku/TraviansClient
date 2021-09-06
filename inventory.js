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
  Object.keys(thisPlayer.inventory.equiped).forEach((type) => {
    const element = document.querySelector(`.${type}`);
    if (thisPlayer.inventory.equiped[type].name) {
      element.firstChild.src = getItemPath(
        thisPlayer.inventory.equiped[type].name
      );
    } else {
      element.firstChild.src = "/assets/items/placeholder/" + type + ".png";
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

  Array.from(inventoryElement.children[1].children).forEach(
    (inventoryItemElement) => {
      inventoryItemElement.addEventListener("drop", drop);
      inventoryItemElement.addEventListener("dragover", dragover);
      inventoryItemElement.firstChild.addEventListener("dragstart", drag);
      inventoryItemElement.firstChild.draggable = true;
    }
  );
  Array.from(inventoryElement.children[0].children).forEach(
    (equipmentItemElement) => {
      equipmentItemElement.addEventListener("drop", drop);
      equipmentItemElement.addEventListener("dragover", dragover);
      equipmentItemElement.firstChild.addEventListener("dragstart", drag);
      equipmentItemElement.firstChild.draggable = true;
    }
  );
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
    craftable.sourceItems.forEach((item) =>
      craftPossibility.appendChild(createSourceItemElement(item))
    );

    craftingPossibilitiesElement.appendChild(craftPossibility);
  });
}

function createDivElement(...classes) {
  const el = document.createElement("div");
  el.classList.add(...classes);
  return el;
}
function createSourceItemElement(item) {
  const el = createItemElement(item.name);
  const p = document.createElement("p");
  p.innerHTML = item.requiredAmount;
  el.appendChild(p);
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
  console.log(sourceItems.map((item) => collapsedInventory[item.name]));
  return (
    sourceItems.length ===
    sourceItems
      .map(
        (item) =>
          collapsedInventory[item.name] &&
          collapsedInventory[item.name] >= item.requiredAmount
      )
      .filter(Boolean).length
  );
}

function dragover(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData(
    "text",
    ev.target.parentElement.id || ev.target.parentElement.classList[0]
  );
}

function parseMoveAction(sourceSpot, targetSpot) {
  let parsedSource = Number.parseInt(sourceSpot);
  let parsedTarget = Number.parseInt(targetSpot);
  if (Number.isNaN(parsedSource)) {
    parsedSource = sourceSpot;
  }
  if (Number.isNaN(parsedTarget)) {
    parsedTarget = targetSpot;
  }

  if (typeof parsedSource === "number" && typeof parsedTarget === "number") {
    return ["move", parsedSource, parsedTarget];
  }
  if (typeof parsedSource === "string" && typeof parsedTarget === "number") {
    return ["unequip", parsedSource, parsedTarget];
  }
  if (typeof parsedSource === "number" && typeof parsedTarget === "string") {
    return ["equip", parsedSource, parsedTarget];
  }
}

function drop(ev) {
  ev.preventDefault();

  const [action, sourceSpot, targetSpot] = parseMoveAction(
    ev.dataTransfer.getData("text"),
    ev.target.parentElement.id
  );
  console.log(action, sourceSpot, targetSpot);
  console.log(action, typeof sourceSpot, typeof targetSpot);
  if (action === "equip") {
    if (thisPlayer.inventory.items[sourceSpot].name)
      equipItem(thisPlayer.inventory.items[sourceSpot]);
  }
  if (action === "unequip") {
    if (thisPlayer.inventory.equiped[sourceSpot].name)
      unequipItem(thisPlayer.inventory.equiped[sourceSpot]);
  }

  if (action === "move") {
    socket.emit("items:move", {
      player: thisPlayer,
      sourceIndex: sourceSpot,
      targetIndex: targetSpot,
    });
  }
}

function equipItem(item) {
  socket.emit("items:equip", {
    player: thisPlayer,
    itemToEquip: item,
  });
}
function unequipItem(item) {
  socket.emit("items:unequip", {
    player: thisPlayer,
    itemToUnequip: item,
  });
}
