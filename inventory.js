showPanel = false;
currentPanel = "";
panelList = {};
ITEMS = [];
BUILDINGS = [];
function sendCommand(command, block) {
  socket.emit("items:action", {
    player: thisPlayer,
    action: command,
    block: block,
  });
}

function sendCommandBuilding(command, building) {
  socket.emit("buildings:action", {
    player: thisPlayer,
    action: command,
    building: building,
    block: lockedBlock,
  });
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

function getBuildingPath(buildingName) {
  return "assets/buildings/" + buildingName + ".png" || "assets/knight.png";
}

function updateInventory(inventory) {
  thisPlayer.inventory = inventory;

  __updateShow();
}

function __updateShow() {
  if (currentPanel === "movement") showControls();
  if (currentPanel === "inventory") showInventory();
  if (currentPanel === "crafting") showPossibleCrafting();
  if (currentPanel === "building") showBuildings();
}

function showInventory() {
  const itemsElement = inventoryElement.children[1].children;

  const inventory = thisPlayer.inventory;
  if (!inventory) return;
  inventory.items.forEach((item, index) => {
    if (item) {
      itemsElement[index].children[0].src = getItemPath(
        ITEMS.find((i) => i.name === item.name)?.name
      );
      itemsElement[index].children[1].innerHTML = item.stackSize;
    } else {
      itemsElement[index].children[0].src = "assets/blank.png";
      itemsElement[index].children[1].innerHTML = "";
    }
  });
  Object.keys(inventory.equiped).forEach((type) => {
    const element = document.querySelector(`.${type}`);
    if (thisPlayer.inventory.equiped[type].name) {
      element.firstChild.src = getItemPath(
        thisPlayer.inventory.equiped[type].name
      );
    } else {
      element.firstChild.src = "assets/items/placeholder/" + type + ".png";
    }
  });
}

window.addEventListener("load", (e) => {
  controlsButton = document.querySelector(".controls-toggle");
  inventoryButton = document.querySelector(".inventory-toggle");
  craftingButton = document.querySelector(".crafting-toggle");
  buildingButton = document.querySelector(".building-toggle");
  controlsElement = document.querySelector(".controls");
  inventoryElement = document.querySelector(".inventory");
  craftingElement = document.querySelector(".crafting");
  buildingElement = document.querySelector(".building");
  panelList = {
    controls: {
      element: controlsElement,
      button: controlsButton,
      // callback: showControls,
    },
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
      callback: showBuildings,
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
      inventoryItemElement.addEventListener("touchend", doubletaphandler);
      inventoryItemElement.addEventListener("click", doubletaphandler);
      inventoryItemElement.firstChild.addEventListener("dragstart", drag);
      inventoryItemElement.firstChild.draggable = true;
    }
  );
  Array.from(inventoryElement.children[0].children).forEach(
    (equipmentItemElement) => {
      equipmentItemElement.addEventListener("drop", drop);
      equipmentItemElement.addEventListener("dragover", dragover);
      equipmentItemElement.addEventListener("touchend", doubletaphandler);
      equipmentItemElement.addEventListener("click", doubletaphandler);
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

const nMap = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [0, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
];

function nearbyBuildingHasCraftingFacility(craftable) {
  const nearbyBuildings = buildings.filter((b) => {
    return (
      nMap
        .map((coords) => {
          return (
            thisPlayer.x + coords[0] == b.x && thisPlayer.y + coords[1] == b.y
          );
        })
        .filter(Boolean).length > 0
    );
  });
  if (!nearbyBuildings) return false;
  const { facility } = craftable;
  let canCraft = false;
  const craftingFacilities = nearbyBuildings.map((nb) => nb.craftingFacilities);
  craftingFacilities.forEach((facilities) => {
    facilities.forEach((f) => {
      if (!canCraft && facility.includes(f.name)) {
        canCraft = true;
      }
    });
  });
  return canCraft;
}

function showPossibleCrafting() {
  function _prepare(craftingPossibilitiesElement, craftPossibility, craftable) {
    const resultElement = createItemElement(craftable.result);
    craftPossibility.appendChild(resultElement);
    craftPossibility.appendChild(createArrowElement());
    craftable.sourceItems.forEach((item) =>
      craftPossibility.appendChild(createSourceItemElement(item))
    );
    if (craftable.facility?.length >= 1) {
      craftPossibility.appendChild(createArrowElement());
      craftable.facility.forEach((f) => {
        const bWithCrafting = BUILDINGS.filter(
          (b) => !!b.craftingFacilities
        ).map((b) => {
          return {
            name: b.name,
            facilities: b.craftingFacilities.map((cf) => cf.name),
          };
        });
        bWithCrafting.forEach((bwc) => {
          if (bwc.facilities.includes(f)) {
            craftPossibility.appendChild(createBuildingElement(bwc.name));
            return;
          }
        });
      });
    }
    craftingPossibilitiesElement.appendChild(craftPossibility);
    return resultElement;
  }
  if (currentPanel !== "crafting") return;
  const collapsedInventory = collapseInventory(thisPlayer.inventory);
  const craftableItems = ITEMS.filter((item) => item.craftable)
    .map((item) => item.craftable)
    .filter((craftable) =>
      inventoryHasAllSourceItems(collapsedInventory, craftable.sourceItems)
    )
    .filter(
      (craftable) =>
        craftable.facility.includes("inventory-craft") ||
        nearbyBuildingHasCraftingFacility(craftable)
    );
  const notCraftable = ITEMS.filter((item) => item.craftable)
    .map((item) => item.craftable)
    .filter((item) => !craftableItems.includes(item));
  const craftingPossibilitiesElement = document.querySelector(
    ".crafting-possibilities"
  );
  craftingPossibilitiesElement.innerHTML = "";
  craftableItems.forEach((craftable) => {
    const craftPossibility = createDivElement("craft-possibility");
    const resultElement = _prepare(
      craftingPossibilitiesElement,
      craftPossibility,
      craftable
    );
    resultElement.addEventListener("click", () => {
      craftItem(craftable.result);
    });
  });
  notCraftable.forEach((craftable) => {
    const craftPossibility = createDivElement("craft-possibility", "inactive");
    _prepare(craftingPossibilitiesElement, craftPossibility, craftable);
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

function createItemElement(itemName, ...classes) {
  const el = createDivElement("item", ...classes);
  const img = document.createElement("img");
  img.src = getItemPath(itemName);
  el.appendChild(img);
  return el;
}
function createBuildingElement(buildingName, ...classes) {
  const el = createDivElement("item", ...classes);
  const img = document.createElement("img");
  img.src = getBuildingPath(buildingName);
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
let lastTapAtTime = 0;

function doubletaphandler(ev) {
  const source =
    ev.target.parentElement.id || ev.target.parentElement.classList[0];
  const action = Number.isNaN(Number.parseInt(source)) ? "unequip" : "equip";

  if (Date.now() - lastTapAtTime < 300) {
    if (action === "equip") {
      if (thisPlayer.inventory.items[source]?.name)
        equipItem(thisPlayer.inventory.items[source]);
    }
    if (action === "unequip") {
      if (thisPlayer.inventory.equiped[source].name)
        unequipItem(thisPlayer.inventory.equiped[source]);
    }
  } else {
    document.querySelector(".itemName").innerHTML =
      action == "equip"
        ? thisPlayer.inventory.items[source]?.name
        : thisPlayer.inventory.equiped[source]?.name;
  }
  lastTapAtTime = Date.now();
}
function createBuilding(block, building) {
  socket.emit("buildings:create", {
    player: thisPlayer,
    building,
    block,
  });
}

function showBuildings() {
  function _prepare(buildingPossibilitiesElement, buildPossibility, building) {
    const resultElement = createBuildingElement(building.name);
    buildPossibility.appendChild(resultElement);
    buildPossibility.appendChild(createArrowElement());
    building.buildable.sourceItems.forEach((item) =>
      buildPossibility.appendChild(createSourceItemElement(item))
    );
    buildingPossibilitiesElement.appendChild(buildPossibility);
    if (building.level > 1) {
      const upgradeFrom = BUILDINGS.find(
        (b) => building.name === b?.upgrade?.name
      );
      buildPossibility.appendChild(createArrowElement());
      buildPossibility.appendChild(createBuildingElement(upgradeFrom.name));
    }
    return resultElement;
  }
  if (currentPanel !== "building") return;
  const collapsedInventory = collapseInventory(thisPlayer.inventory);
  const buildable = BUILDINGS.filter((item) =>
    inventoryHasAllSourceItems(collapsedInventory, item.buildable.sourceItems)
  ).filter((b) => b.level == 1);
  const notBuildable = BUILDINGS.filter((item) => !buildable.includes(item));
  const buildingPossibilitiesElement = document.querySelector(
    ".building-possibilities"
  );

  buildingPossibilitiesElement.innerHTML = "";
  buildable.forEach((building) => {
    const buildPossibility = createDivElement("craft-possibility");
    const resultElement = _prepare(
      buildingPossibilitiesElement,
      buildPossibility,
      building
    );
    resultElement.addEventListener("click", () => {
      const playerBlock = findBlockByXY(thisPlayer.x, thisPlayer.y);
      createBuilding(playerBlock, building);
    });
  });
  notBuildable.forEach((building) => {
    const buildPossibility = createDivElement("craft-possibility", "inactive");
    _prepare(buildingPossibilitiesElement, buildPossibility, building);
  });
}
