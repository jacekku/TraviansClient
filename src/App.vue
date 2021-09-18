<script setup lang="ts">
import Login from "./components/Login.vue";
import ContextMenu from "./components/ContextMenu.vue";
import Inventory from "./components/Inventory.vue";
import Controls from "./components/Controls.vue";
import Crafting from "./components/Crafting.vue";
import Building from "./components/Building.vue";
import IconBar from "./components/IconBar.vue";
</script>

<template>
  <Login></Login>
  <ContextMenu></ContextMenu>
  <div class="container">
    <Controls></Controls>
    <Inventory></Inventory>
    <Crafting></Crafting>
    <Building></Building>
    <IconBar></IconBar>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.inactive {
  opacity: 0.5;
}

.visible {
  visibility: visible;
}
.hidden {
  visibility: hidden;
}

.game {
  margin: 0;
  padding: 0;
  border: 2px solid black;
}

canvas {
  margin: 0;
  padding: 0;
  width: inherit;
  height: inherit;
}

body {
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.icon-bar img {
  image-rendering: pixelated;
}

#login {
  position: absolute;
  z-index: 10;
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

.game {
  grid-area: game;
}
.container {
  grid-area: container;
}
.icon-bar {
  grid-area: icon-bar;
  margin-top: auto;
  margin-bottom: 0px;
}
</style>
