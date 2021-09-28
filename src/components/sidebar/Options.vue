<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import SoundHandler from "../../SoundHandler";
export default defineComponent({
  data() {
    return {
      SoundHandler,
    };
  },
  methods: {
    changeVolume({ target }: { target: any }) {
      const volume = target.value / 100;
      SoundHandler.changeVolume(volume, target.id);
    },
  },
  computed: {
    panel(): string {
      return this.$store.state.panel;
    },
  },
});
</script>

<template>
  <div v-if="panel === 'options'" id="sound">
    <p>sound</p>
    <div class="slidecontainer">
      <p>SFX</p>
      <input
        type="range"
        min="1"
        max="100"
        @change="changeVolume"
        :value="SoundHandler.sfxVolume * 100"
        class="slider"
        id="SFX"
      />
    </div>
    <div class="slidecontainer">
      <p>MUSIC</p>
      <input
        type="range"
        min="1"
        max="100"
        @change="changeVolume"
        :value="SoundHandler.musicVolume * 100"
        class="slider"
        id="MUSIC"
      />
    </div>
  </div>
</template>

<style scoped>
#sound div input {
  transform: rotate(270deg);
}
#sound div {
  display: inline-block;
}
</style>
