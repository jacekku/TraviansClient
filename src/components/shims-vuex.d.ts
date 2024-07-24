// vuex-shim.d.ts

import { ComponentCustomProperties } from "vue";
import { Store } from "vuex";
import {
  Block,
  Building,
  BuildingDefinition,
  Chunk,
  Equiped,
  FacilitiesDefinition,
  Item,
  ItemDefinition,
  Player,
  PlayerState,
  Terrain,
} from "../model/Models";
import { FirebaseUser } from "../types";

declare module "@vue/runtime-core" {
  // Declare your own store states.
  interface State {
    terrain: Terrain;
    players: Player[];
    buildings: Building[];
    player: Player;
    chunks: Chunk[];
    count: number;
    items: Item[];
    equiped: Equiped;
    panel: string;
    buildingDefinitions: BuildingDefinition[];
    itemDefinitions: ItemDefinition[];
    facilitiesDefinitions: FacilitiesDefinition[];
    selectedBlock: Block;
    selectedBuilding: BuildingDefinition;
    playerState: PlayerState;
    pointer: { x: number; y: number };
    timer: { id: string; endTime: number };
    user: FirebaseUser;
    alertContent: string;
  }

  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}
