<script lang="ts">
import { MUTATION_TYPE } from "../types";

export default {
  data() {
    return {
      choices: [
        { className: "controls", image: "movement" },
        { className: "inventory", image: "inventory" },
        { className: "crafting", image: "craft" },
        { className: "building", image: "build" },
      ],
    };
  },
  methods: {
    imagePath(name: string): string {
      return `src/assets/${name}.png`;
    },
    classChanger(name: string): string {
      return name + "-toggle";
    },
    setPanel(name: string) {
      this.$store.commit(MUTATION_TYPE.setPanel, name);
    },
  },
};
</script>

<template>
  <div class="icon-bar">
    <img
      v-for="choice in choices"
      v-bind:class="classChanger(choice.className)"
      v-bind:src="imagePath(choice.image)"
      v-on:click="setPanel(choice.className)"
    />
  </div>
</template>

<style scoped>
div img {
  width: 50px;
  image-rendering: pixelated;
}
.icon-bar {
  grid-area: icon-bar;
  margin-top: auto;
  margin-bottom: 0px;
}
</style>
