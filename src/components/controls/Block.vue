<script lang="ts">
export default {
  computed: {
    block() {
      return this.$store.state.selectedBlock;
    },
    building() {
      return this.$store.state.selectedBuilding;
    },
  },
};
</script>

<template>
  <div class="block">
    <pre>
    {{ block }}
    {{ building }}
</pre
    >
  </div>
</template>

<style scoped>
.block {
  grid-area: block;
}
</style>
