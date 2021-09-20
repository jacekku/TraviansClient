<script lang="ts">
import { sendMovePlayer } from "../../socket";

export default {
  data() {
    return {
      directions: [
        { direction: "left", method: this.moveLeft },
        { direction: "right", method: this.moveRight },
        { direction: "up", method: this.moveUp },
        { direction: "down", method: this.moveDown },
        { direction: "up-left", method: this.moveUpLeft },
        { direction: "up-right", method: this.moveUpRight },
        { direction: "down-left", method: this.moveDownLeft },
        { direction: "down-right", method: this.moveDownRight },
      ],
    };
  },
  computed: {
    panel(): string {
      return this.$store.state.panel;
    },
  },
  methods: {
    necessaryData(): any {
      return {
        player: this.$store.state.player,
        terrain: this.$store.state.terrain,
        chunks: this.$store.state.chunks,
      };
    },
    moveDown() {
      const { player, terrain, chunks } = this.necessaryData();
      sendMovePlayer(player.name, player.x, player.y + 1, terrain, chunks);
    },
    moveUp() {
      const { player, terrain, chunks } = this.necessaryData();
      sendMovePlayer(player.name, player.x, player.y - 1, terrain, chunks);
    },
    moveLeft() {
      const { player, terrain, chunks } = this.necessaryData();
      sendMovePlayer(player.name, player.x - 1, player.y, terrain, chunks);
    },
    moveRight() {
      const { player, terrain, chunks } = this.necessaryData();
      sendMovePlayer(player.name, player.x + 1, player.y, terrain, chunks);
    },
    moveDownLeft() {
      const { player, terrain, chunks } = this.necessaryData();
      sendMovePlayer(player.name, player.x - 1, player.y + 1, terrain, chunks);
    },
    moveDownRight() {
      const { player, terrain, chunks } = this.necessaryData();
      sendMovePlayer(player.name, player.x + 1, player.y + 1, terrain, chunks);
    },
    moveUpLeft() {
      const { player, terrain, chunks } = this.necessaryData();
      sendMovePlayer(player.name, player.x - 1, player.y - 1, terrain, chunks);
    },
    moveUpRight() {
      const { player, terrain, chunks } = this.necessaryData();
      sendMovePlayer(player.name, player.x + 1, player.y - 1, terrain, chunks);
    },
  },
};
</script>

<template>
  <div v-if="panel == 'controls'" class="controls">
    <div class="actions">
      <div v-for="dir in directions" v-bind:class="dir.direction">
        <img src="src/assets/movement-cardinal.png" />
      </div>
    </div>
    <div class="movement">
      <div
        v-for="dir in directions"
        v-bind:class="dir.direction"
        @click="dir.method"
      >
        <img src="src/assets/movement-cardinal.png" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.controls {
  position: absolute;
  display: grid;
  grid-template-areas:
    "actions"
    "movement";
  width: 50vw;
  height: 100%;
}
.controls > div {
  display: grid;
  grid-template-areas:
    "up-left up up-right"
    "left . right"
    "down-left down down-right";
  margin: auto;
  width: 100%;
  height: 100%;
}

.controls > div > div {
  width: fit-content;
  height: fit-content;
  margin: auto;
}

.movement {
  grid-area: movement;
  margin-top: auto;
  margin-bottom: 0px;
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
</style>
