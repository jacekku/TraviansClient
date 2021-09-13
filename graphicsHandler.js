let blockSize = 3;
const frustumSize = 13;

function drawChunk(chunk) {
  const chunkSize = terrain.chunkSize;
  const chunkX = chunk.x * blockSize;
  const chunkY = chunk.y * blockSize;
  // strokeWeight(5);
  // stroke("#f00");
  // fill("#aaa");
  rect(chunkX, chunkY, chunkSize * blockSize, chunkSize * blockSize);
}

function drawBuildings(buildings) {
  buildings.forEach((building) => drawBuilding(building));
}

function drawBuilding(building) {
  let img = mapImageToString(building.name, "BUILDING");
  if (!img) {
    return;
  }
  image(
    img,
    building.x * blockSize,
    building.y * blockSize,
    blockSize,
    blockSize
  );
}

function drawBlock(block) {
  // strokeWeight(0.5)
  // stroke("#222")
  fill(getBlockColor(block));
  rect(block.x * blockSize, block.y * blockSize, blockSize, blockSize);
  fill(255);
  // text(`${block.x},${block.y}`,block.x * blockSize+2,block.y * blockSize+textSize())
  moistureImg = mapImageToString(block.moisture);
  if (moistureImg) {
    image(
      moistureImg,
      block.x * blockSize,
      block.y * blockSize,
      blockSize,
      blockSize
    );
  }
  materialRichnessImg = mapImageToString(block.materials);
  if (materialRichnessImg) {
    image(
      materialRichnessImg,
      block.x * blockSize,
      block.y * blockSize,
      blockSize,
      blockSize
    );
  }
  animalsImg = mapImageToString(block.animals);
  if (animalsImg) {
    image(
      animalsImg,
      block.x * blockSize,
      block.y * blockSize,
      blockSize,
      blockSize
    );
  }
}

function mapImageToString(name, TYPE) {
  const string = name.toLowerCase();
  if (string == "none") return;
  let path;
  switch (TYPE) {
    case "BUILDING":
      path = "buildings/";
      break;
    case "ITEM":
      path = "items/";
    default:
      path = "map/";
      break;
  }
  const imageName = path + string;
  if (IMAGES[imageName]) {
    return IMAGES[imageName];
  }
  loadImage(
    "assets/" + path + string + ".png",
    (img) => (IMAGES[imageName] = img),
    (err) => (IMAGES[imageName] = IMAGES.error)
  );
  IMAGES[imageName] = IMAGES.error;
  return IMAGES.error;
}

IMAGES = {};

function preload() {
  loadImage("assets/error.png", (img) => (IMAGES.error = img));
}

function setup() {
  const size = Math.min(500, window.innerWidth);
  let c = createCanvas(size, size);

  blockSize = width / frustumSize;
  c.parent("game");
  textSize(10);
  noStroke();
  noSmooth();
}

function draw() {
  background(0);
  if (terrain && terrain.chunks) {
    const frustum = getFrustum(X, Y);
    pointer = getPointer(frustum);

    translate(-frustum.x * blockSize, -frustum.y * blockSize);
    const chunks = terrain.chunks;
    for (chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
      if (!chunks[chunkIndex]) continue;

      const chunk = chunks[chunkIndex];
      drawChunk(chunk);
      for (blockIndex = 0; blockIndex < chunk.blocks.length; blockIndex++) {
        const block = chunk.blocks[blockIndex];
        drawBlock(block);
      }
    }
    drawBuildings(buildings);
    drawPlayers();
    drawFrustum(frustum);
    drawPointer(pointer);
  }
}

function drawFrustum(frustum) {
  noFill();
  // stroke("#00f")
  rect(
    frustum.x * blockSize,
    frustum.y * blockSize,
    frustumSize * blockSize,
    frustumSize * blockSize
  );
}

function getFrustum(X, Y) {
  let x = clampNumber(
    X - Math.floor(frustumSize / 2),
    0,
    terrain.width - frustumSize
  );
  let y = clampNumber(
    Y - Math.floor(frustumSize / 2),
    0,
    terrain.height - frustumSize
  );
  return {
    x,
    y,
  };
}

function getPointer(frustum) {
  return {
    x: Math.floor(frustum.x + (mouseX | 0) / blockSize) * blockSize,
    y: Math.floor(frustum.y + (mouseY | 0) / blockSize) * blockSize,
  };
}

function drawPlayers() {
  push();
  fill("white");
  stroke("black");
  textSize(10);
  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    const img = mapImageToString("knight");
    if (player && img) {
      image(
        img,
        player.x * blockSize,
        player.y * blockSize,
        blockSize,
        blockSize
      );
    }
    text(player.name, player.x * blockSize, player.y * blockSize);
  }
  pop();
}

function drawPointer(pointer) {
  push();
  stroke("red");
  strokeWeight(2);
  rect(pointer.x, pointer.y, blockSize, blockSize);
  pop();
}

function getBlockColor(block) {
  if (block.biome == "MOUNTAIN") return "gray";
  if (block.biome == "PLAIN") return "#228c08";
  if (block.biome == "BEACH") return "yellow";
  if (block.biome == "DEEP_WATER") return "darkblue";
  if (block.biome == "SHALLOW_WATER") return "blue";
  if (block.biome == "HILLS") return "#1b6e07";
  return "black";
}

function clampNumber(num, min, max) {
  return Math.min(Math.max(num, min), max);
}
