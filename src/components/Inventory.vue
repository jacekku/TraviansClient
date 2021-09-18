<script setup lang="ts"></script>
<template v-if="currentPanel === 'inventory'">
  <div class="inventory" style="visibility: visible">
    <div class="character">
      <div class="chest item">
        <img src="src/assets/items/placeholder/chest.png" />
      </div>
      <div class="legs item">
        <img src="src/assets/items/placeholder/legs.png" />
      </div>
      <div class="pauldrons item">
        <img src="src/assets/items/placeholder/pauldrons.png" />
      </div>
      <div class="head item">
        <img src="src/assets/items/placeholder/head.png" />
      </div>
      <div class="gauntlets item">
        <img src="src/assets/items/placeholder/gauntlets.png" />
      </div>
      <div class="cape item">
        <img src="src/assets/items/placeholder/cape.png" />
      </div>
      <div class="shirt item">
        <img src="src/assets/items/placeholder/shirt.png" />
      </div>
      <div class="boots item">
        <img src="src/assets/items/placeholder/boots.png" />
      </div>
      <div class="mainhand item">
        <img src="src/assets/items/placeholder/mainhand.png" />
      </div>
      <div class="offhand item">
        <img src="src/assets/items/placeholder/offhand.png" />
      </div>
      <div class="trinket item">
        <img src="src/assets/items/placeholder/trinket.png" />
      </div>
      <div class="ring item">
        <img src="src/assets/items/placeholder/ring.png" />
      </div>
    </div>
    <div class="items">
      <div class="item" id="0">
        <img src="src/assets/blank.png" />
        <p class="stackSize"></p>
      </div>
      <div class="item" id="1">
        <img src="src/assets/blank.png" />
        <p class="stackSize"></p>
      </div>
      <div class="item" id="2">
        <img src="src/assets/blank.png" />
        <p class="stackSize"></p>
      </div>
      <div class="item" id="3">
        <img src="src/assets/blank.png" />
        <p class="stackSize"></p>
      </div>
      <div class="item" id="4">
        <img src="src/assets/blank.png" />
        <p class="stackSize"></p>
      </div>
      <div class="item" id="5">
        <img src="src/assets/blank.png" />
        <p class="stackSize"></p>
      </div>
      <div class="item" id="6">
        <img src="src/assets/blank.png" />
        <p class="stackSize"></p>
      </div>
      <div class="item" id="7">
        <img src="src/assets/blank.png" />
        <p class="stackSize"></p>
      </div>
      <div class="item" id="8">
        <img src="src/assets/blank.png" />
        <p class="stackSize"></p>
      </div>
      <div class="item" id="9">
        <img src="src/assets/blank.png" />
        <p class="stackSize"></p>
      </div>
      <div class="item" id="10">
        <img src="src/assets/blank.png" />
        <p class="stackSize"></p>
      </div>
      <div class="item" id="11">
        <img src="src/assets/blank.png" />
        <p class="stackSize"></p>
      </div>
      <div class="item" id="12">
        <img src="src/assets/blank.png" />
        <p class="stackSize"></p>
      </div>
      <div class="item" id="13">
        <img src="src/assets/blank.png" />
        <p class="stackSize"></p>
      </div>
      <div class="item" id="14">
        <img src="src/assets/blank.png" />
        <p class="stackSize"></p>
      </div>
      <div class="item" id="15">
        <img src="src/assets/blank.png" />
        <p class="stackSize"></p>
      </div>
    </div>
    <p class="itemName"></p>
  </div>
</template>

<style scoped>
:root {
  --col-size: 4;
}

.craft-possibility {
  border: 1px solid gray;
  display: flex;
}

.container {
  overflow: hidden;
}

.crafting {
  width: inherit;
  height: inherit;
  overflow: hidden;
}
.items {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr;
  gap: 0px 0px;
  grid-template-areas:
    ". . . ."
    ". . . ."
    ". . . ."
    ". . . .";
}

.character {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr;
  gap: 0px 0px;
  grid-auto-flow: row;
  grid-template-areas:
    "pauldrons head gauntlets"
    "cape chest shirt"
    "boots legs ring"
    "trinket mainhand offhand";
  grid-area: character;
}

.inventory {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0px 0px;
  grid-auto-flow: row;
  grid-template-areas: "character" "items";
}

.item {
  border: 1px solid black;
  position: relative;
  width: 4vw;
  height: 4vw;
}

.item img {
  image-rendering: pixelated;
  width: 100%;
  height: 100%;
  position: absolute;
}

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

.character div {
  border: 1px solid red;
}

.items {
  grid-area: items;
}

.chest {
  grid-area: chest;
}

.legs {
  grid-area: legs;
}

.mainhand {
  grid-area: mainhand;
}

.pauldrons {
  grid-area: pauldrons;
}

.head {
  grid-area: head;
}

.gauntlets {
  grid-area: gauntlets;
}

.cape {
  grid-area: cape;
}

.shirt {
  grid-area: shirt;
}

.boots {
  grid-area: boots;
}

.offhand {
  grid-area: offhand;
}

.trinket {
  grid-area: trinket;
}

.ring {
  grid-area: ring;
}

.container .inventory {
  position: absolute;
}
.container .crafting {
  position: absolute;
}
.container .building {
  position: absolute;
}
</style>
