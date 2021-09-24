<script lang="ts">
import { sendMovePlayer, socket } from "../socket";
import { MUTATION_TYPE } from "../types";
import { defineComponent } from "vue";
import Utilities from "../Utilities";

export default defineComponent({
  data() {
    return { socket: socket };
  },
  mounted() {
    window.addEventListener("move", this.handleMove as any);
    window.addEventListener("craft", this.handleCraft as any);
    window.addEventListener("build", this.handleBuild as any);
    window.addEventListener("unequip", this.handleUnequip as any);
    window.addEventListener("equip", this.handleEquip as any);
    window.addEventListener("command", this.sendCommand as any);
    window.addEventListener(
      "command:building",
      this.sendCommandBuilding as any
    );
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
    sendCommand({ detail }: { detail: any }) {
      const { player, selectedBlock } = this.necessaryData();
      if (!Utilities.objectNearEachOther(player, selectedBlock)) {
        alert("you are too far away");
        return;
      }
      socket.emit("items:action", {
        player,
        action: detail.command,
        block: selectedBlock,
      });
      this.requestUpdateAll();
    },
    sendCommandBuilding({ detail }: { detail: any }) {
      const { player, selectedBlock, selectedBuilding } = this.necessaryData();
      if (!Utilities.objectNearEachOther(player, selectedBlock)) {
        alert("you are too far away");
        return;
      }
      socket.emit("buildings:action", {
        player,
        action: detail.command,
        building: selectedBuilding,
        block: selectedBlock,
      });
      this.requestUpdateAll();
    },

    handleUnequip({ detail }: { detail: string }) {
      const { player } = this.necessaryData();
      socket.emit("items:unequip", {
        player,
        itemToUnequip: { name: detail },
      });
      this.requestUpdateAll();
    },
    handleEquip({ detail }: { detail: string }) {
      const { player } = this.necessaryData();
      socket.emit("items:equip", {
        player,
        itemToEquip: { name: detail },
      });
      this.requestUpdateAll();
    },
    handleBuild({ detail }: { detail: string }) {
      const { player, selectedBlock } = this.necessaryData();
      if (!player.name) return;
      socket.emit("buildings:create", {
        player,
        building: { name: detail },
        block: selectedBlock,
      });
      this.requestUpdateAll();
    },
    handleCraft({ detail }: { detail: string }) {
      const { player } = this.necessaryData();
      if (!player.name) return;
      socket.emit("items:craft", {
        player,
        itemToCraft: { name: detail },
      });
      this.requestUpdateAll();
    },
    handleMove({ detail }: { detail: string }) {
      this.$store.commit(MUTATION_TYPE.setSelectedBlock, {});
      this.$store.commit(MUTATION_TYPE.setPlayerState, {
        state: "moving",
      });
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
      const method = (map as any)[detail];
      if (method) method();
      this.requestUpdateAll();
    },
    requestUpdateAll() {
      const { player } = this.necessaryData();
      const payload = { player: { name: player.name } };
      socket.emit("items:update", payload);
      socket.emit("players:requestUpdate", payload);
      socket.emit("buildings:requestUpdate", payload);
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
        selectedBuilding: this.$store.state.selectedBuilding,
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
