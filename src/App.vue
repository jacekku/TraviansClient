<script setup lang="ts">
import IconBar from "./components/IconBar.vue";
import Login from "./components/login/Login.vue";
import Canvas from "./components/game/Canvas.vue";
import SideBar from "./components/sidebar/SideBar.vue";
import SocketWrapper from "./components/SocketWrapper.vue";
import Controls from "./components/sidebar/Controls.vue";
import Movement from "./components/controls/Movement.vue";
import Actions from "./components/controls/Actions.vue";
import Block from "./components/controls/Block.vue";
import { defineComponent } from "@vue/runtime-core";
import ContextMenu from "./components/ContextMenu.vue";
</script>

<script lang="ts">
import { socket } from "./socket";
export default defineComponent({
  computed: {
    controls() {
      return this.$store.state.panel == "controls"
        ? "controls-grid"
        : "game-grid";
    },
    panel(): string {
      return this.$store.state.panel;
    },
    socket() {
      console.log("socket update in APP");
      return socket;
    },
  },
});
</script>

<template>
  <SocketWrapper></SocketWrapper>
  <Login></Login>
  <ContextMenu></ContextMenu>
  <div class="game-container" :class="controls">
    <Canvas></Canvas>
    <IconBar></IconBar>
    <Block v-if="panel == 'controls'"></Block>
    <Movement v-if="panel == 'controls'"></Movement>
    <Actions v-if="panel == 'controls'"></Actions>
    <SideBar></SideBar>
  </div>
</template>

<style>
img {
  image-rendering: pixelated;
}

.inactive {
  opacity: 0.5;
}

body {
  margin: 0;
  padding: 0;
}

.game-container {
  display: grid;
  width: 100vw;
  height: 100vh;
  max-width: 1280px;
  max-height: 720px;
  border: 1px solid black;
}

.game-grid {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 90% 1fr;
  gap: 0px 0px;
  grid-auto-flow: row;
  grid-template-areas:
    "game container"
    "icon-bar container";
}

.controls-grid {
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: 50% 40% 10%;
  gap: 0px 0px;
  grid-auto-flow: row;
  grid-template-areas:
    ". game options"
    "movement game actions"
    "movement icon-bar actions";
}

:root {
  --scale-value: 4;
}

.item img {
  image-rendering: pixelated;
  width: 100%;
  height: 100%;
  position: absolute;
}

.item {
  border: 1px solid black;
  position: relative;
  width: 4vw;
  height: 4vw;
}

.movement {
  grid-area: movement;
  margin-bottom: 0px;
  margin-top: auto;
}

.actions {
  grid-area: actions;
  margin-top: 0px;
  margin-bottom: auto;
}

.up {
  grid-area: up;
  transform: scale(var(--scale-value)) rotate(-90deg);
}
.down {
  grid-area: down;
  transform: scale(var(--scale-value)) rotate(90deg);
}
.left {
  grid-area: left;
  transform: scale(var(--scale-value)) rotate(-180deg);
}
.right {
  grid-area: right;
  transform: scale(var(--scale-value));
}
.up-left {
  grid-area: up-left;
  transform: scale(var(--scale-value)) rotate(-135deg);
}
.up-right {
  grid-area: up-right;
  transform: scale(var(--scale-value)) rotate(-45deg);
}
.down-left {
  grid-area: down-left;
  transform: scale(var(--scale-value)) rotate(135deg);
}
.down-right {
  grid-area: down-right;
  transform: scale(var(--scale-value)) rotate(45deg);
}

.movement,
.actions {
  display: grid;
  place-items: center;
  grid-template-areas:
    "up-left up up-right"
    "left . right"
    "down-left down down-right";
  margin: auto;
  width: 100%;
  height: 100%;
}
</style>
