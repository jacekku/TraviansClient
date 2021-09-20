import CanvasDrawer from "./canvasDrawer";
import Utilities from "./Utilities";
type Block = {
  x: number;
  y: number;
  biome: string;
  materials: string;
  animals: string;
  moisture: string;
  id: number;
};

type Chunk = {
  x: number;
  y: number;
  blocks: Block[];
};

type Terrain = {
  chunkSize: number;
  chunks: Chunk[];
  mapId: string;
  chunkNumber: number;
  width: number;
  height: number;
};

const IMAGES: Map<string, any> = new Map();
const errorImage = new Image();
errorImage.src = mapImageToString("error");

function loadImage(src: string) {
  return new Promise((resolve, reject) => {
    const image = new Image();

    function cleanup() {
      image.onload = null;
      image.onerror = null;
    }

    image.onload = () => {
      cleanup();
      resolve(image);
    };
    image.onerror = (err) => {
      cleanup();
      reject(err);
    };

    image.src = src;
  });
}

function getBlockColor(block: Block) {
  if (block.biome == "MOUNTAIN") return "gray";
  if (block.biome == "PLAIN") return "#44ae2a";
  if (block.biome == "BEACH") return "yellow";
  if (block.biome == "DEEP_WATER") return "darkblue";
  if (block.biome == "SHALLOW_WATER") return "blue";
  if (block.biome == "HILLS") return "#1b6e07";
  return "black";
}

function drawPlayers(drawer: CanvasDrawer, players: any[], blockSize: number) {
  drawer.push();
  drawer.fill("white");
  drawer.stroke("black");
  drawer.textSize(10);
  const img = mapImageToString("knight", "MAP");
  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    if (player && img) {
      drawer.image(
        img,
        player.x * blockSize,
        player.y * blockSize,
        blockSize,
        blockSize
      );
    }
    drawer.text(player.name, player.x * blockSize, player.y * blockSize);
  }
  drawer.pop();
}

function getFrustum(
  X: number,
  Y: number,
  terrain: Terrain,
  frustumSize: number
) {
  let x = Utilities.clampNumber(
    X - Math.floor(frustumSize / 2),
    0,
    terrain.width - frustumSize
  );
  let y = Utilities.clampNumber(
    Y - Math.floor(frustumSize / 2),
    0,
    terrain.height - frustumSize
  );
  return {
    x,
    y,
  };
}

function findChunkByXY(blockX: number, blockY: number, terrain: Terrain) {
  return {
    x: Math.floor(blockX / terrain.chunkSize) * terrain.chunkSize,
    y: Math.floor(blockY / terrain.chunkSize) * terrain.chunkSize,
  };
}
function draw(
  drawer: CanvasDrawer,
  terrain: Terrain,
  chunks: Chunk[],
  players: [{ x: number; y: number }],
  thisPlayer: { x: number; y: number },
  buildings: any[],
  blockSize: number,
  frustumSize: number
) {
  drawer.background("gray");
  drawer.push();
  if (terrain && chunks) {
    const frustum = getFrustum(
      thisPlayer.x,
      thisPlayer.y,
      terrain,
      frustumSize
    );
    // pointer = getPointer(frustum);
    drawer.translate(-frustum.x * blockSize, -frustum.y * blockSize);

    const frustumChunks = [
      findChunkByXY(frustum.x, frustum.y, terrain),
      findChunkByXY(frustum.x, frustum.y + frustumSize, terrain),
      findChunkByXY(frustum.x + frustumSize, frustum.y, terrain),
      findChunkByXY(frustum.x + frustumSize, frustum.y + frustumSize, terrain),
    ];
    const visibleChunks = chunks.filter((chunk: { x: any; y: any }) => {
      return !!frustumChunks.find((XY) => XY.x === chunk.x && XY.y === chunk.y);
    });
    for (let chunkIndex = 0; chunkIndex < visibleChunks.length; chunkIndex++) {
      if (!visibleChunks[chunkIndex]) continue;

      const chunk = visibleChunks[chunkIndex];
      drawChunk(drawer, terrain, chunk, blockSize);
      for (let blockIndex = 0; blockIndex < chunk.blocks.length; blockIndex++) {
        const block = chunk.blocks[blockIndex];
        drawBlock(drawer, block, blockSize);
      }
    }
    drawBuildings(drawer, buildings, blockSize);
    drawPlayers(drawer, players, blockSize);
    // if (currentPanel == "crafting" && showPanel) {
    //   drawer.fill("#0f04");
    //   drawer.rect(
    //     thisPlayer.x * blockSize - blockSize,
    //     thisPlayer.y * blockSize - blockSize,
    //     3 * blockSize,
    //     3 * blockSize
    //   );
    // }

    // if (selectedBlock) drawSelectedBlock(selectedBlock);
    drawer.pop();
  }
}

function drawSelectedBlock(
  drawer: CanvasDrawer,
  selectedBlock: { x: number; y: number },
  blockSize: number
) {
  drawer.push();
  drawer.stroke("red");
  drawer.rect(
    selectedBlock.x * blockSize,
    selectedBlock.y * blockSize,
    blockSize,
    blockSize
  );
  drawer.pop();
}

function mapImageToString(name: string, TYPE: string = "") {
  const string = name.toLowerCase();
  if (string == "none") return;
  let path;
  switch (TYPE) {
    case "BUILDING":
      path = "buildings/";
      break;
    case "ITEM":
      path = "items/";
    case "MAP":
      path = "map/";
      break;
    default:
      path = "";
      break;
  }
  const imageName = path + string;
  if (IMAGES.has(imageName)) {
    return IMAGES.get(imageName);
  }
  loadImage("src/assets/" + path + string + ".png")
    .then((img) => IMAGES.set(imageName, img))
    .catch((err: any) => IMAGES.set(imageName, IMAGES.get("error")));

  IMAGES.set(imageName, IMAGES.get("error"));
  return IMAGES.get("error");
}

function drawBlock(drawer: CanvasDrawer, block: Block, blockSize: number) {
  drawer.fill(getBlockColor(block));
  drawer.rect(
    block.x * blockSize,
    block.y * blockSize,
    blockSize + 1,
    blockSize + 1
  );
  const biomeImg = mapImageToString(block.biome, "MAP");
  if (biomeImg) {
    drawer.image(
      biomeImg,
      block.x * blockSize,
      block.y * blockSize,
      blockSize,
      blockSize
    );
  }

  const materialRichnessImg = mapImageToString(block.materials, "MAP");
  if (materialRichnessImg) {
    drawer.image(
      materialRichnessImg,
      block.x * blockSize,
      block.y * blockSize,
      blockSize,
      blockSize
    );
  }
  const animalsImg = mapImageToString(block.animals, "MAP");
  if (animalsImg) {
    drawer.image(
      animalsImg,
      block.x * blockSize,
      block.y * blockSize,
      blockSize,
      blockSize
    );
  }
  const moistureImg = mapImageToString(block.moisture, "MAP");
  if (moistureImg) {
    drawer.image(
      moistureImg,
      block.x * blockSize,
      block.y * blockSize,
      blockSize,
      blockSize
    );
  }
}

function drawChunk(
  drawer: CanvasDrawer,
  terrain: Terrain,
  chunk: { x: number; y: number },
  blockSize: number
) {
  const chunkSize = terrain.chunkSize;
  const chunkX = chunk.x * blockSize;
  const chunkY = chunk.y * blockSize;
  drawer.stroke("red");
  drawer.strokeRect(
    chunkX,
    chunkY,
    chunkSize * blockSize,
    chunkSize * blockSize
  );
}

function drawBuildings(
  drawer: CanvasDrawer,
  buildings: any[],
  blockSize: number
) {
  buildings.forEach((building: any) =>
    drawBuilding(drawer, building, blockSize)
  );
}

function drawBuilding(
  drawer: CanvasDrawer,
  building: { name: string; x: number; y: number },
  blockSize: number
) {
  let img = mapImageToString(building.name, "BUILDING");
  if (!img) {
    return;
  }
  drawer.image(
    img,
    building.x * blockSize,
    building.y * blockSize,
    blockSize,
    blockSize
  );
}

export { draw };
