import { MUTATION_TYPE } from "../types";
<script setup lang="ts">
import AlertBubble from "./misc/AlertBubble.vue";
import AlertBox from "./misc/AlertBox.vue";
import { MUTATION_TYPE } from "../types";
</script>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { getImage } from "../imageUtils";

export default defineComponent({
  props: {
    name: String,
    Class: String,
    imgSrc: String,
  },
  methods: {
    imagePath(name: string | undefined): string {
      if (!name) return "ERROR";
      return getImage(name, "base");
    },
    setPanel(name: string | undefined) {
      if (!name) return;
      (this as any).$refs.alertBubble.clearAlerts();
      this.$store.commit(MUTATION_TYPE.setPanel, name);
    },
  },
});
</script>

<template>
  <div :class="Class" @click="setPanel(name)">
    <AlertBox :alert-type="name"></AlertBox>
    <AlertBubble :alert-type="name" ref="alertBubble"></AlertBubble>
    <img :src="imagePath(imgSrc)" />
  </div>
</template>
<style scoped>
img {
  width: 50px;
  image-rendering: pixelated;
}
</style>
