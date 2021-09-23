<script lang="ts">
export default {
  props: {
    className: String,
    imageSource: String,
    stackSize: Number,
    imageType: String,
  },

  methods: {
    mapImageToString(name: string | undefined, TYPE = ""): string {
      const string = name?.toLowerCase();
      let path;
      switch (TYPE) {
        case "BUILDING":
          path = "buildings/";
          break;
        case "ITEM":
          path = "items/";
          break;
        case "PLACEHOLDER":
          path = "items/placeholder/";
          break;
        default:
          path = "";
          break;
      }
      return "src/assets/" + path + string + ".png";
    },
  },
};
</script>

<template>
  <div :class="className" class="item">
    <img :src="mapImageToString(imageSource, imageType)" />
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
