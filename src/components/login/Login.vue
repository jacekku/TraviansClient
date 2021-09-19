<script lang="ts">
import { socket } from "../../socket";
export default {
  data() {
    return {
      playerName: "",
    };
  },
  methods: {
    connect: function () {
      socket.emit("players:connect", {
        player: {
          name: (this as any).$data.playerName,
        },
      });
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
