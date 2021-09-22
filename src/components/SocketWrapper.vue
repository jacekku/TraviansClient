<script lang="ts">
import { sendMovePlayer, socket } from "../socket";
import { MUTATION_TYPE } from "../types";
import { defineComponent } from "vue";

export default defineComponent({
  mounted() {
    window.addEventListener("move", this.handleEvent);
    window.addEventListener("craft", this.handleCraft);
    window.addEventListener("build", this.handleBuild);
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
    handleBuild({ detail }) {
      const { player, selectedBlock } = this.necessaryData();
      if (!player.name) return;
      socket.emit("buildings:create", {
        player,
        building: { name: detail },
        block: selectedBlock,
      });
    },
    handleCraft({ detail }) {
      const { player } = this.necessaryData();
      if (!player.name) return;
      socket.emit("items:craft", {
        player,
        itemToCraft: { name: detail },
      });
    },
    handleEvent({ detail }) {
      this.$store.commit(MUTATION_TYPE.setSelectedBlock, {});

      const data = this.necessaryData();
      if (!data.player.name || !data.terrain.mapId || !data.chunks.length)
        return;
      const map: object = {
        left: this.moveLeft,
        right: this.moveRight,
        up: this.moveUp,
        down: this.moveDown,
        "up-left": this.moveUpLeft,
        "up-right": this.moveUpRight,
        "down-left": this.moveDownLeft,
        "down-right": this.moveDownRight,
      };
      const method = map[detail];
      if (method) method();
    },
    onConnected() {
      console.log("onConnected");
    },
    onDisconnected() {
      console.log("onDisconnected");
    },
    updatePlayers(newPlayers: any[]) {
      const playerName = this.$store.state.player.name;
      const players = newPlayers;
      const newPlayer = players.find(
        (player_: any) => playerName === player_.name
      );
      this.$store.commit(MUTATION_TYPE.setPlayers, players);
      this.$store.commit(MUTATION_TYPE.setPlayer, newPlayer);
    },
    handleConnected() {
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
    onTerrainInfo(terrain: object) {
      this.$store.commit(MUTATION_TYPE.setTerrain, terrain);
    },
    onTerrainChunk(data: object) {
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
    onPlayersRequestUpdate(data: any) {
      this.updatePlayers(data);
    },
    onBuildingsRequestUpdate(data: any) {
      this.updateBuildings(data);
    },
    onItemsUpdate(data: any) {
      this.updateInventory(data);
    },
    updateBuildings(data: any) {
      this.$store.commit(MUTATION_TYPE.setBuildings, data);
    },
    updateInventory(data: any) {
      this.$store.commit(MUTATION_TYPE.setInventory, data);
    },
    necessaryData(): any {
      return {
        player: this.$store.state.player,
        terrain: this.$store.state.terrain,
        chunks: this.$store.state.chunks,
        selectedBlock: this.$store.state.selectedBlock,
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
});
</script>
<template></template>
