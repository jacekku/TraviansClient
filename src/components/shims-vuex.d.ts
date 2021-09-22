// vuex-shim.d.ts

import { ComponentCustomProperties } from "vue";
import { Store } from "vuex";

declare module "@vue/runtime-core" {
  // Declare your own store states.
  interface State {
    terrain: any;
    players: any;
    buildings: any;
    player: any;
    chunks: any;
    count: number;
    items: any[];
    equiped: object;
    panel: string;
    buildingDefinitions: any[];
    itemDefinitions: any[];
    facilitiesDefinitions: any[];
    selectedBlock: any;
    selectedBuilding: any;
  }

  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}
