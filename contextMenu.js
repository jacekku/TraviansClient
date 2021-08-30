let menuVisible = false;
menu = "";
menuOptions = "";
selectedBlock = {};
lockedBlock = {};

function showOptions(option) {
  menuOptions.innerHTML = "";
  menuOptions.appendChild(createHeader(option));
  switch (option) {
    case "DEER":
      menuOptions.appendChild(createLi("HUNT", console.log, "HUNT"));
      break;
    case "IRON":
    case "COPPER":
    case "GOLD":
      menuOptions.appendChild(createLi("MINE", console.log, "MINE"));
      break;
    case "FISH":
      menuOptions.appendChild(createLi("FISH", console.log, "FISH"));
      break;
    case "FOREST":
      menuOptions.appendChild(createLi("CHOP WOOD", console.log, "CHOP WOOD"));
      break;
  }
  return true;
}

function createLi(text, callback = () => {}, ...callbackArgs) {
  const li = document.createElement("li");
  li.classList.add("menu-option");
  li.addEventListener("click", (a) => {
    keepOpen = callback(...callbackArgs);
    toggleMenu("hide");
    if (keepOpen) {
      toggleMenu("show");
    }
  });
  li.innerHTML = text;
  return li;
}

function createHeader(text) {
  const p = document.createElement("div");
  p.classList.add("menu-header");
  p.innerHTML = text;
  return p;
}

function blockIsAdjacentToPlayer(block, X, Y) {
  return (
    (block.x === X - 1 || block.x === X + 1 || block.x === X) &&
    (block.y === Y - 1 || block.y === Y + 1 || block.y === Y)
  );
}

function showBlockOptions(block) {
  menuOptions.innerHTML = "";
  menuOptions.appendChild(createHeader("Block Options"));

  if (blockIsAdjacentToPlayer(block, X, Y))
    menuOptions.appendChild(createLi("Move here", movePlayer, block));
  menuOptions.appendChild(createLi("Actions", showBlockInfo, block));
}

function showBlockInfo(block) {
  menuOptions.innerHTML = "";
  menuOptions.appendChild(createHeader("Block Info"));

  const animal = ANIMALS[block.animals];
  const moisture = MOISTURE[block.moisture];
  const materialRichness = MATERIAL_RICHNESS[block.materialRichness];
  const blockType = BIOMES[block.type];

  animal != "NONE"
    ? menuOptions.appendChild(createLi(animal, showOptions, animal))
    : null;
  moisture != "NONE"
    ? menuOptions.appendChild(createLi(moisture, showOptions, moisture))
    : null;
  materialRichness != "NONE"
    ? menuOptions.appendChild(
        createLi(materialRichness, showOptions, materialRichness)
      )
    : null;
  blockType
    ? menuOptions.appendChild(createLi(blockType, showOptions, blockType))
    : null;
  return true;
}

const toggleMenu = (command) => {
  menu.style.display = command === "show" ? "block" : "none";
  menuVisible = !menuVisible;
};

const setPosition = ({ top, left }) => {
  menu.style.left = `${left}px`;
  menu.style.top = `${top}px`;
  toggleMenu("show");
};

function addEventListeners(gameDiv) {
  function contextMenuEvent(e) {
    e.preventDefault();
    const origin = {
      left: e.pageX || e.changedTouches[0].pageX,
      top: e.pageY || e.changedTouches[0].pageY,
    };
    setPosition(origin);
    lockedBlock = selectedBlock;
    showBlockOptions(lockedBlock);
    return false;
  }

  gameDiv.addEventListener("dblclick", contextMenuEvent);
  gameDiv.addEventListener("touchend", contextMenuEvent);

  window.addEventListener("click", (e) => {
    if (![...e.path].includes(menu)) {
      if (menuVisible) toggleMenu("hide");
    }
  });
}
window.addEventListener("load", (_) => {
  menu = document.querySelector(".menu");
  menuOptions = document.querySelector(".menu-options");
  gameDiv = document.querySelector("#game");
  addEventListeners(gameDiv);
});
