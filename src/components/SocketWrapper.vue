<script lang="ts">
import { socket } from "../socket";
import { MUTATION_TYPE } from "../types";

export default {
  mounted() {
    socket.on("exception", (data) => alert(JSON.stringify(data.message)));
    socket.on("message", (data) => console.log("socket.on message: " + data));
    socket.on("connect", this.onConnected);
    socket.on("disconnected", this.onDisconnected);
    socket.on("players:all", this.updatePlayers);
    socket.on("players:connect", this.handleConnected);
    socket.on("terrain:info", this.onTerrainInfo);
    socket.on("terrain:chunk", this.onTerrainChunk);
    socket.on("players:update", this.onPlayersUpdate);
    socket.on("buildings:update", this.onBuildingsUpdate);
    socket.on("players:requestUpdate", this.onPlayersRequestUpdate);
    socket.on("buildings:requestUpdate", this.onBuildingsRequestUpdate);
    socket.on("items:update", this.onItemsUpdate);
  },
  methods: {
    onConnected(data) {
      console.log("onConnected");
    },
    onDisconnected(data) {
      console.log("onDisconnected");
    },
    updatePlayers(newPlayers) {
      const playerName = this.$store.state.player.name;
      const players = newPlayers;
      const newPlayer = players.find(
        (player_: any) => playerName === player_.name
      );
      this.$store.commit(MUTATION_TYPE.setPlayers, players);
      this.$store.commit(MUTATION_TYPE.setPlayer, newPlayer);
    },
    handleConnected(data) {
      console.log("handleConnected");
      const player = {
        name: this.$store.state.player?.name,
      };
      socket.emit("players:requestUpdate", { player });
      socket.emit("items:update", { player });
      socket.emit("terrain:info");
      socket.emit("terrain:chunk", {
        player,
        chunks: this.$store.state.chunks,
      });
      socket.emit("buildings:requestUpdate", { player });
    },
    onTerrainInfo(terrain) {
      this.$store.commit(MUTATION_TYPE.setTerrain, terrain);
    },
    onTerrainChunk(data) {
      this.$store.commit(MUTATION_TYPE.addChunk, data);
    },
    onPlayersUpdate() {
      socket.emit("players:requestUpdate", {
        player: { name: this.$store.state.player.name },
      });
    },
    onBuildingsUpdate() {
      socket.emit("buildings:requestUpdate", {
        player: { name: this.$store.state.player.name },
      });
    },
    onPlayersRequestUpdate(data) {
      this.updatePlayers(data);
    },
    onBuildingsRequestUpdate(data) {
      this.updateBuildings(data);
    },
    onItemsUpdate(data) {
      this.updateInventory(data);
    },
    updateBuildings(data) {
      this.$store.commit(MUTATION_TYPE.setBuildings, data);
    },
    updateInventory(data) {
      this.$store.commit(MUTATION_TYPE.setInventory, data);
    },
  },
};
</script>
<template></template>
