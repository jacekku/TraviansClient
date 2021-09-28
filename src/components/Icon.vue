<script setup lang="ts">
import AlertBubble from "./misc/AlertBubble.vue";
</script>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { getImage } from "../imageUtils";

export default defineComponent({
  props: {
    Class: String,
    imgSrc: String,
  },
  methods: {
    imagePath(name: string | undefined): string {
      if (!name) return "ERROR";
      return getImage(name, "base");
    },
  },
});
</script>

<template>
  <div :class="Class">
    <AlertBubble :alerts="10"></AlertBubble>
    <img :src="imagePath(imgSrc)" />
  </div>
</template>
<style scoped>
img {
  width: 50px;
  image-rendering: pixelated;
}
</style>
