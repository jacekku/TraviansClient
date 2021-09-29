<script lang="ts">
import { Component, defineComponent } from "@vue/runtime-core";
import { VueElement } from "@vue/runtime-dom";
import { getImage, ImageType } from "../../imageUtils";

export default defineComponent({
  props: {
    alertType: String,
  },
  methods: {
    spawn(itemName: string, type: ImageType) {
      const img = document.createElement("img");
      img.classList.add("dis-alert");
      img.src = getImage(itemName, type);
      console.log(img);
      setTimeout(() => {
        img.classList.add("dis-alert-active");
      }, 1);
      setTimeout(() => {
        img.remove();
      }, 2500);
      (this as any).$refs.container.appendChild(img);
    },
  },
  mounted() {
    window.addEventListener("alert:" + this.alertType, ({ detail }: any) => {
      this.spawn(detail.itemName, detail.imageType);
    });
  },
});
</script>

<template>
  <div class="alert-container" ref="container"></div>
</template>

<style scoped>
.alert-container {
  width: 50px;
  height: 50px;
  position: absolute;
  transform: translateY(-100%);
}
</style>
<style>
.dis-alert {
  width: 50px;
  height: 50px;
  transition: opacity 2.5s, transform 2.5s;
  margin-top: auto;
  position: absolute;
}
.dis-alert-active {
  opacity: 0;
  transform: translateY(100%);
}
</style>
