<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { socket } from "../../socket";
import { MUTATION_TYPE } from "../../types";
export default defineComponent({
  data() {
    return {
      playerName: "",
      socket: socket,
    };
  },
  methods: {
    connect: function () {
      const player = {
        name: (this as any).$data.playerName,
      };
      this.$store.commit(MUTATION_TYPE.setPlayer, player);
      this.socket.connect();
      this.socket.emit("players:connect", { player });
    },
  },
});
</script>
<template>
  <div class="login" v-if="socket.disconnected">
    <input type="text" v-model="playerName" />
    <button @click="connect">connect</button>
    <h1 v-if="!socket.connected">disconnected</h1>
  </div>
</template>

<style scoped>
.login {
  position: absolute;
  z-index: 10;
}
h1 {
  position: absolute;
  text-align: center;
  font-size: 5em;
  color: red;
}
</style>
