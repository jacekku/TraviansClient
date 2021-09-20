<script lang="ts">
import { socket } from "../../socket";
import { MUTATION_TYPE } from "../../types";
export default {
  data() {
    return {
      playerName: "",
    };
  },
  methods: {
    connect: function () {
      const player = {
        name: (this as any).$data.playerName,
      };
      this.$store.commit(MUTATION_TYPE.setPlayer, player);
      socket.emit("players:connect", { player });
    },
  },
};
</script>
<template>
  <div class="login">
    <input
      type="text"
      v-bind:value="playerName"
      v-on:input="playerName = $event.target.value"
    />
    <button @click="connect">connect</button>
  </div>
</template>

<style scoped>
.login {
  position: absolute;
  z-index: 10;
}
</style>
