<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { Block, Building, BuildingDefinition } from "../../model/Models";
import { ACTION_MAPPER } from "../../types";
export default defineComponent({
  computed: {
    block(): Block {
      return this.$store.state.selectedBlock;
    },
    building(): BuildingDefinition {
      return this.$store.state.selectedBuilding;
    },
    actionMapper(): any {
      return ACTION_MAPPER;
    },
    possibleActions() {
      return [
        (this as any).block.biome,
        (this as any).block.animals,
        (this as any).block.moisture,
        (this as any).block.materials,
      ].filter((type) => type != "NONE");
    },
  },
  methods: {
    accordion(event: any) {
      let target = event.target;
      if (target.tagName == "H4" || target.tagName == "H3") {
        target = target.parentNode;
      } else {
        return;
      }
      target.classList.toggle("active");
      const panel = target.querySelector(".panel");
      if (panel.style.display === "block") {
        panel.style.display = "none";
      } else {
        panel.style.display = "block";
      }
    },
    commitAction(event: any) {
      event.preventDefault();
      const command = event.target.innerHTML;
      const ev = new CustomEvent("command", { detail: { command } });
      dispatchEvent(ev);
    },
    commitActionBuilding(event: any) {
      event.preventDefault();
      const command = event.target.innerHTML;
      const ev = new CustomEvent("command:building", { detail: { command } });
      dispatchEvent(ev);
    },
  },
});
</script>

<template>
  <div class="block">
    <div v-if="block" class="block">
      <h3>Block</h3>
      <div v-for="type in possibleActions" class="accordion" @click="accordion">
        <h4>{{ type }}</h4>
        <div class="panel">
          <div v-for="action in actionMapper[type]" @click="commitAction">
            {{ action }}
          </div>
        </div>
      </div>
    </div>
    <div v-if="building" class="building accordion" @click="accordion">
      <h3>Building</h3>
      <div class="panel">
        <div
          v-for="action in actionMapper.BUILDING"
          @click="commitActionBuilding"
        >
          {{ action }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.block {
  grid-area: block;
}
h3,
h4 {
  text-align: center;
  margin: 0px;
}

/* Style the buttons that are used to open and close the accordion panel */
.accordion {
  background-color: #eee;
  color: #444;
  cursor: pointer;
  text-align: left;
  border: none;
  outline: none;
  transition: 0.4s;
  margin: 4px;
}

/* Add a background color to the button if it is clicked on (add the .active class with JS), and when you move the mouse over it (hover) */
.active,
.accordion:hover {
  background-color: #ccc;
}

/* Style the accordion panel. Note: hidden by default */
.panel {
  background-color: rgb(170, 170, 170);
  display: none;
  overflow: hidden;
}

.panel div {
  margin: 3%;
  background-color: rgb(211, 211, 211);
}
.panel div:hover {
  background-color: rgb(249, 255, 158);
}
</style>
