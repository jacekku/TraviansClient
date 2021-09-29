<script setup lang="ts">
import AlertBubble from "./misc/AlertBubble.vue";
import Icon from "./Icon.vue";
</script>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { getImage } from "../imageUtils";
import { MUTATION_TYPE } from "../types";
import Utilities from "../Utilities";

export default defineComponent({
  data() {
    return {
      choices: [
        { className: "controls", image: "movement" },
        { className: "inventory", image: "inventory" },
        { className: "crafting", image: "craft" },
        { className: "building", image: "build" },
        { className: "options", image: "options" },
      ],
    };
  },
  methods: {
    classChanger(name: string): string {
      return name + "-toggle";
    },
  },
});
</script>

<template>
  <div class="icon-bar">
    <Icon
      v-for="choice in choices"
      :class="classChanger(choice.className)"
      :name="choice.className"
      :imgSrc="choice.image"
    ></Icon>
  </div>
</template>

<style scoped>
.icon-bar div {
  position: relative;
}
.icon-bar {
  grid-area: icon-bar;
  display: flex;
}
</style>
