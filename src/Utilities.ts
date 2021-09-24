import { Block, Building, Chunk, Directions, Terrain } from "./model/Models";

type position = { x: number; y: number };

export default class Utilities {
  public static clampNumber(num: number, min: number, max: number) {
    return Math.min(Math.max(num, min), max);
  }
  public static objectNearEachOther(obj1: position, obj2: position) {
    const xd = obj1.x - obj2.x;
    const yd = obj1.y - obj2.y;
    return [-1, 0, 1].includes(xd) && [-1, 0, 1].includes(yd);
  }

  public static selectBlock(
    pos: position,
    terrain: Terrain,
    chunks: Chunk[],
    buildings: Building[],
    direction?: Directions
  ): {
    block: Block | undefined;
    building: Building | undefined;
  } {
    const nMap = {
      "up-left": [-1, -1],
      up: [0, -1],
      "up-right": [1, -1],
      left: [-1, 0],
      right: [1, 0],
      "down-left": [-1, 1],
      down: [0, 1],
      "down-right": [1, 1],
    };
    let dir;
    let { x, y } = pos;
    if (direction) {
      dir = nMap[direction as Directions];
      if (!dir) return undefined as any;
      x += dir[0];
      y += dir[1];
    }
    const block = this.findBlockByXY(x, y, terrain, chunks);
    const building = this.findBuilding(x, y, buildings);
    return { block, building };
  }
  public static getPointer(
    pointer: position,
    frustum: position,
    blockSize: number
  ) {
    return {
      x: Math.floor(frustum.x + (pointer.x | 0) / blockSize),
      y: Math.floor(frustum.y + (pointer.y | 0) / blockSize),
    };
  }

  public static findBlockByXY(
    blockX: number,
    blockY: number,
    terrain: Terrain,
    chunks: Chunk[]
  ) {
    const chunkX = Math.floor(blockX / terrain.chunkSize) * terrain.chunkSize;
    const chunkY = Math.floor(blockY / terrain.chunkSize) * terrain.chunkSize;
    const chunk = chunks.find((ch) => ch.x === chunkX && ch.y === chunkY);
    if (!chunk) return;
    return chunk.blocks.find(
      (block: any) => block.x === blockX && block.y === blockY
    );
  }

  public static findBuilding(blockX: number, blockY: number, buildings: any[]) {
    return buildings.find(
      (building) => building.x == blockX && building.y == blockY
    );
  }

  public static getFrustum(
    pos: position,
    terrain: Terrain,
    frustumSize: number
  ) {
    let x = Utilities.clampNumber(
      pos.x - Math.floor(frustumSize / 2),
      0,
      terrain.width - frustumSize
    );
    let y = Utilities.clampNumber(
      pos.y - Math.floor(frustumSize / 2),
      0,
      terrain.height - frustumSize
    );
    return { x, y };
  }
}
