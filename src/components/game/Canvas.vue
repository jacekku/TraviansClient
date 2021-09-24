<script lang="ts">
import { defineComponent } from "vue";

import CanvasDrawer from "../../canvasDrawer";
import { draw } from "../../drawingUtils";
import { MUTATION_TYPE } from "../../types";
import Utilities from "../../Utilities";
export default defineComponent({
  data() {
    const canvas: HTMLCanvasElement = {} as any;
    return {
      drawer: new CanvasDrawer({} as any),
      frustumSize: 9,
      canvas,
      pointer: { x: 0, y: 0 },
    };
  },
  created() {
    window.addEventListener("resize", this.onResize);
  },
  mounted() {
    this.canvas = document.querySelector("canvas") as HTMLCanvasElement;
    const min = Math.min(this.canvas.offsetWidth, this.canvas.offsetHeight);
    this.canvas.width = min;
    this.canvas.height = min;
    this.drawer = new CanvasDrawer(this.canvas.getContext("2d") as any);
    window.addEventListener("keydown", this.handleKeyEvent);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    this.canvas.addEventListener("mousedown", this.handleMouseClick);
    this.canvas.addEventListener("touchend", this.handleMouseClick);
    this.render();
  },
  methods: {
    handleMouseClick(e: MouseEvent | TouchEvent) {
      this.updatePointer(e);
      const playerState = this.$store.state.playerState;
      const { block, building } = Utilities.selectBlock(
        this.pointer,
        this.terrain(),
        this.chunks(),
        this.buildings()
      );
      this.$store.commit(MUTATION_TYPE.setSelectedBlock, block);
      this.$store.commit(MUTATION_TYPE.setSelectedBuilding, building);
      if (playerState.state.includes("building")) {
        const nearPlayer = Utilities.objectNearEachOther(
          { x: this.thisPlayer().x, y: this.thisPlayer().y },
          this.selectedBlock() || { x: -10, y: -10 }
        );
        if (!nearPlayer) return;
        this.$store.commit(MUTATION_TYPE.setPlayerState, {
          state: "building:chosen",
          detail: {
            pointer: { ...this.pointer },
            building: playerState.detail.building,
          },
        });
      }
    },
    updatePointer(e: MouseEvent | TouchEvent) {
      const frustum = Utilities.getFrustum(
        this.thisPlayer(),
        this.terrain(),
        this.frustumSize
      );
      const { x, y } = Utilities.getPointer(
        {
          x: (e as MouseEvent).offsetX || (e as any).changedTouches[0].offsetX,
          y: (e as MouseEvent).offsetY || (e as any).changedTouches[0].offsetY,
        },
        frustum,
        this.blockSize()
      );
      this.pointer.x = x;
      this.pointer.y = y;
    },
    handleMouseMove(e: MouseEvent | TouchEvent) {
      this.updatePointer(e);
    },
    onResize() {
      const min = Math.min(this.canvas.offsetWidth, this.canvas.offsetHeight);
      this.canvas.width = min;
      this.canvas.height = min;
      this.drawer = new CanvasDrawer(this.canvas.getContext("2d") as any);
    },
    handleKeyEvent({ key }: { key: string }) {
      let option = "";
      switch (key) {
        case "w":
        case "W":
        case "ArrowUp":
          option = "up";
          break;
        case "x":
        case "X":
        case "ArrowDown":
          option = "down";
          break;
        case "a":
        case "A":
        case "ArrowLeft":
          option = "left";
          break;
        case "d":
        case "D":
        case "ArrowRight":
          option = "right";
          break;
        case "q":
        case "Q":
          option = "up-left";
          break;
        case "e":
        case "E":
          option = "up-right";
          break;
        case "z":
        case "Z":
          option = "down-left";
          break;
        case "c":
        case "C":
          option = "down-right";
          break;
      }

      const ev = new CustomEvent("move", { detail: option });
      dispatchEvent(ev);
    },

    blockSize(): number {
      return this.canvas.width / this.frustumSize;
    },
    terrain(): any {
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
    playerState() {
      return this.$store.state.playerState;
    },
    selectedBlock() {
      return this.$store.state.selectedBlock;
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
        this.frustumSize,
        this.playerState(),
        this.pointer,
        this.selectedBlock()
      );

      requestAnimationFrame(this.render);
    },
  },
});
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
