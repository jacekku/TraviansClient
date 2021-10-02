<script setup lang="ts">
import IconBar from "./components/IconBar.vue";
import Login from "./components/login/Login.vue";
import Canvas from "./components/game/Canvas.vue";
import SocketWrapper from "./components/wrappers/SocketWrapper.vue";
import Controls from "./components/sidebar/Controls.vue";
import Movement from "./components/controls/Movement.vue";
import Actions from "./components/controls/Actions.vue";
import Block from "./components/controls/Block.vue";
import { defineComponent } from "@vue/runtime-core";
import ContextMenu from "./components/ContextMenu.vue";
import SoundHandler from "./SoundHandler";
import SideBar from "./components/sidebar/SideBar.vue";
import SoundWrapper from "./components/wrappers/SoundWrapper.vue";
import TimerBox from "./components/misc/TimerBox.vue";
</script>

<script lang="ts">
export default defineComponent({
  data() {
    return { SoundHandler };
  },
  computed: {
    controls() {
      return this.$store.state.panel == "controls"
        ? "controls-grid"
        : "game-grid";
    },
    panel(): string {
      return this.$store.state.panel;
    },
  },
});
</script>

<template>
  <SocketWrapper></SocketWrapper>
  <SoundWrapper></SoundWrapper>
  <Login></Login>
  <ContextMenu></ContextMenu>
  <TimerBox></TimerBox>
  <div class="game-container" :class="controls">
    <Canvas></Canvas>
    <IconBar></IconBar>
    <Block v-if="panel == 'controls'"></Block>
    <Movement v-if="panel == 'controls'"></Movement>
    <Actions v-if="panel == 'controls'"></Actions>
    <SideBar v-if="panel !== 'controls'"></SideBar>
  </div>
</template>

<style>
img {
  image-rendering: pixelated;
}

body {
  background-repeat: no-repeat;
  background-size: cover;
}

.inactive {
  opacity: 0.5;
}
body,
html,
* {
  margin: 0;
  padding: 0;
}

.game-container {
  position: absolute;
  display: grid;
  width: 100vw;
  height: 100vh;
  border: 1px solid black;
}

.game-grid {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 85% 15%;
  gap: 0px 0px;
  grid-auto-flow: row;
  grid-template-areas:
    "game container"
    "icon-bar container";
}

.controls-grid {
  grid-template-columns: 1fr 2fr 1fr 0fr;
  grid-template-rows: 45% 40% 10% 0%;
  gap: 0px 0px;
  grid-auto-flow: row;
  grid-template-areas:
    ". game block"
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
  width: 100%;
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
  width: 100%;
  height: 100%;
}
</style>
