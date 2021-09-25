<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import arrowImageUrl from "../../assets/movement-cardinal.png";
export default defineComponent({
  data() {
    return {
      arrowImageUrl,
      directions: [
        { direction: "left", method: () => this.emitEvent("move", "left") },
        { direction: "right", method: () => this.emitEvent("move", "right") },
        { direction: "up", method: () => this.emitEvent("move", "up") },
        { direction: "down", method: () => this.emitEvent("move", "down") },
        {
          direction: "up-left",
          method: () => this.emitEvent("move", "up-left"),
        },
        {
          direction: "up-right",
          method: () => this.emitEvent("move", "up-right"),
        },
        {
          direction: "down-left",
          method: () => this.emitEvent("move", "down-left"),
        },
        {
          direction: "down-right",
          method: () => this.emitEvent("move", "down-right"),
        },
      ],
    };
  },
  methods: {
    emitEvent(eventName: string, option: string) {
      const ev = new CustomEvent(eventName, { detail: option });
      dispatchEvent(ev);
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
  },
  created() {
    window.addEventListener("keydown", this.handleKeyEvent);
  },
});
</script>

<template>
  <div class="movement">
    <div
      v-for="dir in directions"
      v-bind:class="dir.direction"
      @click="dir.method"
    >
      <img :src="arrowImageUrl" />
    </div>
  </div>
</template>
