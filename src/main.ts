import { createApp } from "vue";
import App from "./App.vue";
import { createStore } from "vuex";
import { MUTATION_TYPE } from "./types";
import { URL } from "./socket";
import { PlayerState } from "./model/Models";

import "./imageUtils";
const store = createStore({
  state() {
    return {
      player: {},
      items: [],
      equiped: {},
      terrain: {},
      chunks: [],
      players: [],
      buildings: [],
      panel: "inventory",
      buildingDefinitions: [],
      itemDefinitions: [],
      facilitiesDefinitions: [],
      selectedBlock: {},
      selectedBuilding: {},
      playerState: { state: "crafting" },
    };
  },
  mutations: {
    [MUTATION_TYPE.setInventory](
      state: any,
      newInventory: { items: []; equiped: {} }
    ) {
      state.items = newInventory.items;
      state.equiped = newInventory.equiped;
    },

    [MUTATION_TYPE.addChunk](state: any, newChunk) {
      state.chunks.push(...newChunk);
    },

    [MUTATION_TYPE.setTerrain](state: any, newTerrain) {
      state.terrain = newTerrain;
    },

    [MUTATION_TYPE.setPlayers](state: any, newPlayers) {
      state.players = newPlayers;
    },

    [MUTATION_TYPE.setPlayer](state: any, newPlayer) {
      state.player = newPlayer;
    },
    [MUTATION_TYPE.setPanel](state: any, panel: string) {
      state.panel = panel;
    },
    [MUTATION_TYPE.setDefinitions](state: any, payload) {
      state.itemDefinitions = payload.itemDefinitions;
      state.buildingDefinitions = payload.buildingDefinitions;
      state.facilitiesDefinitions = payload.facilitiesDefinitions;
    },
    [MUTATION_TYPE.setBuildings](state: any, buildings: any) {
      state.buildings = buildings;
    },
    [MUTATION_TYPE.setSelectedBlock](state: any, block: any) {
      state.selectedBlock = block;
    },
    [MUTATION_TYPE.setSelectedBuilding](state: any, building: any) {
      state.selectedBuilding = building;
    },
    [MUTATION_TYPE.setPlayerState](state: any, playerState: PlayerState) {
      state.playerState = playerState;
    },
    [MUTATION_TYPE.setPointer](state: any, pointer: { x: number; y: number }) {
      state.pointer = pointer;
    },
  },
});

const app = createApp(App).use(store).mount("#app");

fetch(URL + "/state/definitions")
  .then((data) => data.json())
  .then((data) => app.$store.commit(MUTATION_TYPE.setDefinitions, data))
  .catch((err) => console.error(err));
