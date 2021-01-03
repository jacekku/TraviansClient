const blockSize = 1
let file


function setup() {
    createCanvas(100,100, SVG)
    background(127)
    createFileInput(loadFile)
    noStroke()
}

function draw() {
    if(!file) {
        return
    }
    console.log('creating')
    createMapImage(file.data)
    save(`${file.name.split('.')[0]}.svg`)
    noLoop()
}

function loadFile(loadedFile) {
    console.log(loadedFile)
    file = loadedFile
}

function createMapImage(data) {
    resizeCanvas(data.width*blockSize,data.height*blockSize)
    drawMap(data.chunks)
}

function drawMap(chunks) {
    console.time()
    for(let i = 0; i < chunks.length;i++) {
        const blocks = chunks[i].blocks
        for(let b = 0; b < blocks.length; b ++) {
            drawBlock(blocks[b])
        }
        console.log(`${100*i/chunks.length}%`)
    }
    console.timeEnd()
}


function drawBlock(block, img) {
    fill(mapTypeToColor(block.type))
    rect(block.x * blockSize, block.y * blockSize, blockSize, blockSize)
}

function mapTypeToColor(type) {
    switch (type) {
        case BIOMES.MOUNTAIN:
            return 'gray'
        case BIOMES.PLAIN:
            return 'darkgreen'
        case BIOMES.WATER:
            return 'darkblue'
        default:
            return 'purple'
    }
}