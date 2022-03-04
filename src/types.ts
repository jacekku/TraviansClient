const ACTION_MAPPER = {
  DEER: ["HUNT"],
  IRON: ["MINE"],
  SALT: ["MINE"],
  COPPER: ["MINE"],
  GOLD: ["MINE"],
  TIN: ["MINE"],
  OIL: ["EXTRACT"],
  COAL: ["MINE"],
  MOUNTAIN: ["GATHER STONES", "MINE STONES"],
  FOREST: ["CHOP WOOD", "GATHER STICKS", "FORAGE BERRIES"],
  FISH: ["FISH"],
  DESERT: ["GATHER SAND"],
  BEACH: ["GATHER SAND"],
  BUILDING: ["DEMOLISH", "UPGRADE", "HARVEST"],
};

const MUTATION_TYPE = {
  setInventory: "setInventory",
  addChunk: "addChunk",
  setTerrain: "setTerrain",
  setPlayers: "setPlayers",
  setPlayer: "setPlayer",
  setPanel: "setPanel",
  setDefinitions: "setDefinitions",
  setBuildings: "setBuildings",
  setSelectedBlock: "setSelectedBlock",
  setSelectedBuilding: "setSelectedBuilding",
  setPlayerState: "setPlayerState",
  setPointer: "setPointer",
  setTimer: "setTimer",
  setUser: "setUser",
};

export type LoginProvider = "GOOGLE";
export type FirebaseUser = {
  uid: string;
  accessToken: string;
  displayName: string;
};
export { ACTION_MAPPER, MUTATION_TYPE };
