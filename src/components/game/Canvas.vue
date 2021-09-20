<script lang="ts">
import CanvasDrawer from "../../canvasDrawer";
import { draw } from "../../drawingUtils";
export default {
  data() {
    return {
      drawer: new CanvasDrawer({} as any),
      frustumSize: 9,
      canvas: {},
    };
  },
  created() {
    window.addEventListener("resize", this.onResize);
  },
  mounted() {
    this.canvas = document.querySelector("canvas");
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    this.drawer = new CanvasDrawer(this.canvas.getContext("2d") as any);

    this.render();
  },
  methods: {
    onResize() {
      const min = Math.max(this.canvas.offsetWidth, this.canvas.offsetHeight);
      this.canvas.width = min;
      this.canvas.height = min;
      this.drawer = new CanvasDrawer(this.canvas.getContext("2d") as any);
    },
    blockSize() {
      return this.canvas.width / this.frustumSize;
    },
    terrain() {
      return this.$store.state.terrain;
    },
    chunks() {
      return this.$store.state.chunks;
    },
    players() {
      return this.$store.state.players;
    },
    thisPlayer() {
      return this.$store.state.player;
    },
    buildings() {
      return this.$store.state.buildings;
    },
    render() {
      draw(
        this.drawer,
        this.terrain(),
        this.chunks(),
        this.players(),
        this.thisPlayer(),
        this.buildings(),
        this.blockSize(),
        this.frustumSize
      );

      requestAnimationFrame(this.render);
    },
  },
};
</script>

<template>
  <div class="game">
    <canvas></canvas>
  </div>
</template>

<style scoped>
.game {
  margin: 0;
  padding: 0;
  border: 2px solid black;
  grid-area: game;
}

canvas {
  image-rendering: -moz-crisp-edges;
  image-rendering: -webkit-crisp-edges;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
</style>
