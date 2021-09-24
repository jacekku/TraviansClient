<script lang="ts">
import { getImage, ImageType } from "../imageUtils";
export default {
  props: {
    className: String,
    imageSource: String,
    stackSize: Number,
    imageType: String,
  },

  methods: {
    getImage(name: any, TYPE: any): any {
      return getImage(name, TYPE);
    },
  },
};
</script>

<template>
  <div :class="className" class="item">
    <img :src="getImage(imageSource, imageType)" />
    <p v-if="stackSize" class="stackSize">{{ stackSize }}</p>
  </div>
</template>

<style scoped>
.item p {
  position: absolute;
  right: 1px;
  padding-top: 40%;
  color: white;
  text-align: left;
  vertical-align: text-bottom;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000,
    1px 1px 0 #000;
}
</style>
