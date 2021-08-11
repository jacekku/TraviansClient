let blockSize = 3
const frustumSize = 13

function drawChunk(chunk) {
    const chunkSize = terrain.chunkSize
    const chunkX = chunk.x * blockSize
    const chunkY = chunk.y * blockSize
    // strokeWeight(5)
    // stroke("#f00")
    // fill("#aaa")
    rect(chunkX, chunkY, chunkSize * blockSize, chunkSize * blockSize)
}

function drawBlock(block) {
    // strokeWeight(0.5)
    // stroke("#222")
    fill(getBlockColor(block))
    rect(block.x * blockSize, block.y * blockSize, blockSize, blockSize)
    fill(255)
    // text(`${block.x},${block.y}`,block.x * blockSize+2,block.y * blockSize+textSize())
    moistureImg = mapImageToString(block.moisture, MOISTURE)
    if (moistureImg) {
        image(moistureImg, block.x * blockSize, block.y * blockSize, blockSize, blockSize)
    }
    materialRichnessImg = mapImageToString(block.materialRichness, MATERIAL_RICHNESS)
    if (materialRichnessImg) {
        image(materialRichnessImg, block.x * blockSize, block.y * blockSize, blockSize, blockSize)
    }
    animalsImg = mapImageToString(block.animals, ANIMALS)
    if (animalsImg) {
        image(animalsImg, block.x * blockSize, block.y * blockSize, blockSize, blockSize)
    }
}


function mapImageToString(type, sourceEnum) {
    string = sourceEnum[type]
    switch (string) {
        case 'COPPER':
            return IMAGES.copper

        case 'DEER':
            return IMAGES.deer

        case 'DESERT':
            return IMAGES.desert

        case 'FIELD':
            return IMAGES.field

        case 'FISH':
            return IMAGES.fish

        case 'FOREST':
            return IMAGES.forest

        case 'GOLD':
            return IMAGES.gold

        case 'IRON':
            return IMAGES.iron

        default:
            break;
    }
}
let IMAGES = {}

function preload() {
    const copper = loadImage('assets/copper.png')
    const deer = loadImage('assets/deer.png')
    const desert = loadImage('assets/desert.png')
    const field = loadImage('assets/field.png')
    const fish = loadImage('assets/fish.png')
    const forest = loadImage('assets/forest.png')
    const gold = loadImage('assets/gold.png')
    const iron = loadImage('assets/iron.png')
    const knight = loadImage('assets/knight.png')
    const knightSleeping = loadImage('assets/knightSleeping.png')
    IMAGES = {
        copper,
        deer,
        desert,
        field,
        fish,
        forest,
        gold,
        iron,
        knight,
        knightSleeping
    }

}

function setup() {
    let c = createCanvas(500, 500)

    blockSize = width / frustumSize
    c.parent('game')
    textSize(10)
    noStroke()
}

function draw() {
    background(0)
    if (terrain) {
        const frustum = getFrustum(X, Y)
        const pointer = getPointer(frustum)
        translate(-frustum.x * blockSize, -frustum.y * blockSize)
        const chunks = terrain.chunks
        for (chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
            if (!chunks[chunkIndex]) continue

            const chunk = chunks[chunkIndex]
            drawChunk(chunk)
            for (blockIndex = 0; blockIndex < chunk.blocks.length; blockIndex++) {
                const block = chunk.blocks[blockIndex]
                drawBlock(block)
                if(block.x == pointer.x/blockSize && block.y == pointer.y/blockSize) {
                    selectedBlock = block
                }
            }
        }

        drawPlayers()
        drawFrustum(frustum)
        drawPointer(pointer)
    }
}

function drawFrustum(frustum) {
    noFill()
    // stroke("#00f")
    rect(frustum.x * blockSize, frustum.y * blockSize, frustumSize * blockSize, frustumSize * blockSize)

}

function getFrustum(X, Y) {
    let x = clampNumber(X - Math.floor(frustumSize / 2), 0, terrain.width - frustumSize)
    let y = clampNumber(Y - Math.floor(frustumSize / 2), 0, terrain.height - frustumSize)
    return {
        x,
        y
    }
}

function getPointer(frustum) {
    return {x:Math.floor(frustum.x+mouseX/blockSize)*blockSize, y:Math.floor(frustum.y+mouseY/blockSize)*blockSize}
}

function drawPlayers() {
    push()
    fill("white")
    stroke("black")
    textSize(10)
    for (let i = 0; i < players.length; i++) {
        const player = players[i]
        if (player.active) {
            image(IMAGES.knight, player.x * blockSize, player.y * blockSize, blockSize, blockSize)
        } else {
            image(IMAGES.knightSleeping, player.x * blockSize, player.y * blockSize, blockSize, blockSize)
        }
        text(player.name, player.x * blockSize, player.y * blockSize)
    }
    pop()
}

function drawPointer(pointer) {
    push()
    stroke("red")
    strokeWeight(2)
    rect(pointer.x, pointer.y, blockSize, blockSize)
    pop()
}


function getBlockColor(block) {
    if (BIOMES[block.type] == "MOUNTAIN") return 'gray'
    if (BIOMES[block.type] == "PLAIN") return 'darkgreen'
    if (BIOMES[block.type] == "BEACH") return 'yellow'
    if (BIOMES[block.type] == "WATER") return 'darkblue'
    return block.type
}


function clampNumber(num, min, max) {
    return Math.min(Math.max(num, min), max);
}

function movePlayer() {
    if (keyCode === LEFT_ARROW) {
        X -= 1
    } else if (keyCode === RIGHT_ARROW) {
        X += 1
    } else if (keyCode === UP_ARROW) {
        Y -= 1
    } else if (keyCode === DOWN_ARROW) {
        Y += 1
    }
    X = clampNumber(X, 0, terrain.width - 1)
    Y = clampNumber(Y, 0, terrain.height - 1)
}


