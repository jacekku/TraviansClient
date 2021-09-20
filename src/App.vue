<script setup lang="ts">
import ContextMenu from "./components/ContextMenu.vue";
import IconBar from "./components/IconBar.vue";
import Login from "./components/login/Login.vue";
import Canvas from "./components/game/Canvas.vue";
import SideBar from "./components/sidebar/SideBar.vue";
import SocketWrapper from "./components/SocketWrapper.vue";
</script>

<template>
  <SocketWrapper></SocketWrapper>
  <Login></Login>
  <!-- <ContextMenu></ContextMenu> -->
  <div class="game-container">
    <Canvas></Canvas>
    <IconBar></IconBar>
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
  overflow: hidden;
}

.game-container {
  position: absolute;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 90% 1fr;
  gap: 0px 0px;
  grid-auto-flow: row;
  grid-template-areas:
    "game container"
    "icon-bar container";
  width: 100vw;
  height: 100vh;
  max-width: 1280px;
  max-height: 720px;
  border: 1px solid black;
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
</style>
