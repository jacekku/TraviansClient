<script lang="ts">
import { socket } from "../../socket";
import { MUTATION_TYPE } from "../../types";
import { defineComponent } from "vue";
import Utilities from "../../Utilities";
import { Chunk, PlayerState, Timer } from "../../model/Models";
import { ImageType } from "../../imageUtils";

export default defineComponent({
  data() {
    return { socket: socket, lastDispatch: {} as any };
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
    window.addEventListener("timer:cancel", this.cancelTimer);
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
    socket.on("success", this.onSuccess);
    socket.on("timer", this.handleTimers);
  },
  methods: {
    cancelTimer() {
      const timer = this.$store.state.playerState.detail as Timer;
      socket.emit("timer:cancel", { timer });
      this.$store.commit(MUTATION_TYPE.setPlayerState, { state: "idle" });
    },
    handleTimers(timers: Timer[] | { id: string; endTime: number }) {
      if ((timers as any).id) {
        this.$store.commit(MUTATION_TYPE.setPlayerState, {
          state: "waiting",
          detail: timers,
        } as PlayerState);
      }

      if ((timers as Timer[]).forEach) {
        const { player } = this.necessaryData();
        (timers as Timer[]).forEach((timer) => {
          if (!timer) return;

          if (timer.cancelled) {
            socket.emit("timer:ack", [timer.id, "cancelled", player.name]);
            return;
          }
          if (timer.hasEnded) {
            socket.emit("timer:ack", [timer.id, "ended", player.name]);
            return;
          }
          if (timer.id === this.$store.state.playerState.detail.id) {
            this.$store.commit(MUTATION_TYPE.setPlayerState, {
              state: "waiting",
              detail: timer,
            } as PlayerState);
          }
        });
      }
    },
    onSuccess(data: any) {
      if (!data) return;
      let { success, detail } = data;
      if (!success) {
        success = data;
      }
      const ev = new CustomEvent("success:" + success, { detail });
      dispatchEvent(ev);
      this.$store.commit(MUTATION_TYPE.setPlayerState, { state: "idle" });
      const { player } = this.necessaryData();
      switch (success) {
        case "build":
          this.sendUpdateBuildings(player.name);
          break;
        case "craft":
          this.sendUpdateItems(player.name);
          break;
      }
    },
    sendCommand({ detail }: { detail: any }) {
      const { player, selectedBlock } = this.necessaryData();
      if (!Utilities.objectNearEachOther(player, selectedBlock)) {
        alert("you are too far away");
        return;
      }
      socket.emit("items:action", {
        player: { name: player.name },
        action: detail.command,
        block: selectedBlock,
        success: { success: "action", detail: detail.command },
      });
      // this.sendUpdateItems(player.name);
    },
    sendCommandBuilding({ detail }: { detail: any }) {
      const { player, selectedBlock, selectedBuilding } = this.necessaryData();
      if (!Utilities.objectNearEachOther(player, selectedBlock)) {
        alert("You are too far away!");
        return;
      }
      socket.emit("buildings:action", {
        player: { name: player.name },
        action: detail.command,
        building: selectedBuilding,
        block: selectedBlock,
        success: "build",
      });
    },

    handleUnequip({ detail }: { detail: string }) {
      const { player } = this.necessaryData();
      socket.emit("items:unequip", {
        player: { name: player.name },
        itemToUnequip: { name: detail },
        success: "unequip",
      });
      this.sendUpdateItems(player.name);
    },
    handleEquip({ detail }: { detail: string }) {
      const { player } = this.necessaryData();
      socket.emit("items:equip", {
        player: { name: player.name },
        itemToEquip: { name: detail },
        success: "equip",
      });
      this.sendUpdateItems(player.name);
    },
    handleBuild({ detail }: { detail: string }) {
      const { player, selectedBlock } = this.necessaryData();
      if (!player.name) return;
      socket.emit("buildings:create", {
        player: { name: player.name },
        building: { name: detail },
        block: selectedBlock,
        success: "build",
      });
      this.sendUpdateItems(player.name);
      this.sendUpdateBuildings(player.name);
    },
    handleCraft({ detail }: { detail: string }) {
      const { player } = this.necessaryData();
      if (!player.name) return;
      socket.emit("items:craft", {
        player: { name: player.name },
        itemToCraft: { name: detail },
        success: { success: "craft", detail },
      });
      this.sendUpdateItems(player.name);
    },
    handleMove({ detail }: { detail: string }) {
      this.$store.commit(MUTATION_TYPE.setSelectedBlock, {});
      this.$store.commit(MUTATION_TYPE.setPlayerState, {
        state: "moving",
      });
      const { player, terrain, chunks } = this.necessaryData();
      if (!player.name || !terrain.mapId || !chunks.length) return;
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
      this.sendUpdateTerrain(player.name, chunks);
    },

    onConnected() {
      console.log("onConnected");
    },
    onDisconnected() {
      console.log("onDisconnected");
    },
    updatePlayers(newPlayers: any[]) {
      if (!newPlayers) return;
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
    handleAlertInventory(
      oldInventory: Map<string, number>,
      newInventory: Map<string, number>
    ) {
      const changed = new Map<string, number>();
      Array.from(oldInventory.entries()).forEach((keyValue) => {
        const [key, value] = keyValue;
        changed.set(key, value);
      });
      Array.from(newInventory.entries()).forEach((keyValue) => {
        const [key, value] = keyValue;
        // @ts-ignore
        changed.set(key, value - changed.get(key) || 0);
      });
      Array.from(changed.entries()).forEach((keyValue) => {
        const lastDispatch = this.lastDispatch["alert:inventory"];
        if (lastDispatch && Date.now() - lastDispatch < 10) {
          return;
        }
        const [key, value] = keyValue;
        if (!value) return;
        const ev = new CustomEvent("alert:inventory", {
          detail: { itemName: key, imageType: "items" as ImageType },
        });
        dispatchEvent(ev);
        this.lastDispatch["alert:inventory"] = Date.now();
      });
    },
    onItemsUpdate(data: any) {
      const { items, equiped } = {
        items: this.$store.state.items,
        equiped: this.$store.state.equiped,
      };
      const oldInventory = Utilities.getCollapsedInventory(items);
      const newInventory = Utilities.getCollapsedInventory(data.items);
      this.handleAlertInventory(oldInventory, newInventory);
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
      this.sendMovePlayer(player.name, player.x, player.y + 1, terrain, chunks);
    },
    moveUp() {
      const { player, terrain, chunks } = this.necessaryData();
      this.sendMovePlayer(player.name, player.x, player.y - 1, terrain, chunks);
    },
    moveLeft() {
      const { player, terrain, chunks } = this.necessaryData();
      this.sendMovePlayer(player.name, player.x - 1, player.y, terrain, chunks);
    },
    moveRight() {
      const { player, terrain, chunks } = this.necessaryData();
      this.sendMovePlayer(player.name, player.x + 1, player.y, terrain, chunks);
    },
    moveDownLeft() {
      const { player, terrain, chunks } = this.necessaryData();
      this.sendMovePlayer(
        player.name,
        player.x - 1,
        player.y + 1,
        terrain,
        chunks
      );
    },
    moveDownRight() {
      const { player, terrain, chunks } = this.necessaryData();
      this.sendMovePlayer(
        player.name,
        player.x + 1,
        player.y + 1,
        terrain,
        chunks
      );
    },
    moveUpLeft() {
      const { player, terrain, chunks } = this.necessaryData();
      this.sendMovePlayer(
        player.name,
        player.x - 1,
        player.y - 1,
        terrain,
        chunks
      );
    },
    moveUpRight() {
      const { player, terrain, chunks } = this.necessaryData();
      this.sendMovePlayer(
        player.name,
        player.x + 1,
        player.y - 1,
        terrain,
        chunks
      );
    },
    sendMovePlayer(
      name: string,
      x: number,
      y: number,
      terrain: any,
      chunks: any[]
    ) {
      x = Utilities.clampNumber(x, 0, terrain.width - 1);
      y = Utilities.clampNumber(y, 0, terrain.height - 1);
      if (socket) {
        socket.emit("players:move", {
          player: { name },
          move: { x, y },
          success: "move",
        });
        this.sendUpdateTerrain(name, chunks);
      }
    },
    sendUpdateTerrain(name: string, chunks: Chunk[]) {
      socket.emit("terrain:chunk", {
        player: { name },
        chunks: chunks.map((chunk: Chunk) => chunk.id),
      });
    },
    sendUpdateItems(name: string) {
      socket.emit("items:update", { player: { name } });
    },
    sendUpdateBuildings(name: string) {
      socket.emit("buildings:requestUpdate", { player: { name } });
    },
    sendUpdatePlayers(name: string) {
      socket.emit("players:requestUpdate", { player: { name } });
    },
  },
});
</script>
<template></template>
