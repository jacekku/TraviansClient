let menuVisible = false;
menu = ""
menuOptions = ""
selectedBlock = {}
lockedBlock = {}


function showOptions(option) {
    menuOptions.innerHTML = ''
    menuOptions.appendChild(createHeader(option))
    switch (option) {
        case "DEER":
            menuOptions.appendChild(createLi("HUNT", console.log))
            break;
        case "IRON":
        case "COPPER":
        case "GOLD":
            menuOptions.appendChild(createLi("MINE", console.log))
            break;
        case "FISH":
            menuOptions.appendChild(createLi("FISH", console.log))
            break;
        case "FOREST":
            menuOptions.appendChild(createLi("CHOP WOOD", console.log))
            break;
    }
}

function createLi(text, callback = showOptions) {
    const li = document.createElement('li')
    li.classList.add('menu-option')
    li.addEventListener('click', (a) => callback(a.target.innerHTML))
    li.innerHTML = text
    return li
}

function createHeader(text) {
    const p = document.createElement('div')
    p.classList.add('menu-header')
    p.innerHTML = text
    return p
}

function addBlockInfo(block) {
    menuOptions.innerHTML = ''
    menuOptions.appendChild(createHeader('Block Info'))
    block.animals && block.animals != ANIMALS.NO_ANIMALS ? menuOptions.appendChild(createLi(block.animals)) : null
    block.moisture ? menuOptions.appendChild(createLi(block.moisture)) : null
    block.type ? menuOptions.appendChild(createLi(block.type)) : null
    block.materialRichness ? menuOptions.appendChild(createLi(block.materialRichness)) : null
}


const toggleMenu = command => {
    menu.style.display = command === "show" ? "block" : "none";
    menuVisible = !menuVisible;
};

const setPosition = ({
    top,
    left
}) => {
    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
    toggleMenu("show");
};

window.addEventListener("click", e => {
    if(![...e.path].includes(menu))toggleMenu("hide");
});

window.addEventListener("contextmenu", e => {
    e.preventDefault();
    const origin = {
        left: e.pageX,
        top: e.pageY
    };
    setPosition(origin);
    lockedBlock = selectedBlock
    addBlockInfo(lockedBlock)
    return false;
});

window.addEventListener('load', _ => {
    menu = document.querySelector(".menu");
    menuOptions = document.querySelector(".menu-options");
})