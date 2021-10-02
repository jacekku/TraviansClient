<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { PlayerState } from "../../model/Models";

export default defineComponent({
  computed: {
    state(): PlayerState {
      return this.$store.state.playerState;
    },
    cycleAmount() {
      if (this.state.state != "waiting") return;
      return this.$store.state.playerState.detail.cycleAmount;
    },
    currentCycle() {
      if (this.state.state != "waiting") return;
      const current = this.$store.state.playerState.detail.currentCycle;
      (this as any).$refs.bar.style.width = `${
        (current * 100) / (this.cycleAmount - 1)
      }%`;
    },
  },
  methods: {
    cancelTimer() {
      const ev = new CustomEvent("timer:cancel");
      dispatchEvent(ev);
    },
  },
});
</script>
<template>
  <div v-show="state.state == 'waiting'" class="timer">
    <div class="container">
      <h1>ACTION</h1>
      <div class="bar">
        <div ref="bar" :val="currentCycle"></div>
      </div>
      <button @click="cancelTimer">CANCEL</button>
    </div>
  </div>
</template>

<style scoped>
.timer {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 9;
  display: grid;
  align-items: center;
}
.container {
  display: grid;
  align-items: center;
  grid-template-rows: 1fr 1fr 1fr;
  gap: 20px;
  grid-template-areas: ". title ." "bar bar bar" ". cancel .";
  background-color: rgb(233, 214, 182);
  margin: auto;
  border: 2px solid rgb(173, 86, 86);
}
h1 {
  grid-area: title;
}
button {
  grid-area: cancel;
  height: 100%;
  border-radius: 50px;
  font-size: x-large;
}
.bar {
  width: 80%;
  height: 100%;
  border: 1px solid black;
  border-radius: 25px;
  overflow: hidden;
  grid-area: bar;
  margin: auto;
}
.bar div {
  height: 100%;
  background: rgb(0, 255, 149);
  transition: 1s linear;
}
</style>
