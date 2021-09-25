<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import SoundHandler from "../../SoundHandler";

export default defineComponent({
  mounted() {
    window.addEventListener("success:move", this.move);
    window.addEventListener("success:craft", this.craft);
    window.addEventListener("success:build", this.build);
    window.addEventListener("success:unequip", this.unequip);
    window.addEventListener("success:equip", this.equip);
    window.addEventListener("success:action", this.command as any);
  },
  methods: {
    move() {
      SoundHandler.playRandom("WALKING");
    },
    craft() {
      SoundHandler.playSound("blacksmith_hammer");
    },
    build() {
      SoundHandler.playSound("building_hammer");
    },
    unequip() {
      // no sound for this
    },
    equip() {
      // no sound for this
    },
    command({ detail }: { detail: string }) {
      if (detail == "CHOP WOOD") {
        SoundHandler.playSound("axe_chop");
      }
      if (detail.includes("MINE")) {
        SoundHandler.playSound("pickaxe");
      }
    },
    commandBuilding() {
      SoundHandler.playSound("building_hammer");
    },
  },
});
</script>

<template></template>
