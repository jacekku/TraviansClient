<script lang="ts">
import { defineComponent } from "vue";
import { socket, URL } from "../../socket";
import { MUTATION_TYPE } from "../../types";
import { getAuth } from "firebase/auth";
export default defineComponent({
  data() {
    return {
      newCharacterName: "",
      socket: socket,
      characters: [],
      error: "",
    };
  },
  methods: {
    mapErrorMessage: (message: string) => {
      switch (message) {
        case "EXISTS":
          return "Name already taken";
        case "NAME_EMPTY":
          return "Name cannot be empty";
        case "UID_EMPTY":
          return "User uid is empty, something went very wrong if you're seeing this";
        default:
          return "";
      }
    },
    getCharacters: function () {
      fetch(URL + "/players/characterList/" + this.user.uid, {
        headers: {
          Authorization: `Bearer ${this.user.accessToken}`,
        },
      })
        .then((data) => data.json())
        .then((data) => (this.characters = data))
        .catch((data) => {
          console.error(data);
          this.error = "Server is down";
        });
    },
    connect: function (playerName: string) {
      const player = {
        name: playerName,
      };
      this.$store.commit(MUTATION_TYPE.setPlayer, player);
      this.socket.connect();
      this.socket.emit("players:connect", { player });
    },
    createCharacter: function () {
      if (!this.$data.newCharacterName) return;
      fetch(URL + "/players/character/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.user.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: this.user.uid,
          characterName: this.$data.newCharacterName,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            response.json().then((error) => {
              this.$data.error = this.mapErrorMessage(error.message);
            });
          }
          return response.json();
        })
        .then(() => {
          this.getCharacters();
        });
    },
    signout: function () {
      getAuth()
        .signOut()
        .then(() => {
          this.$store.commit(MUTATION_TYPE.setUser, {});
        });
    },
  },
  computed: {
    user: function () {
      return this.$store.state.user;
    },
  },
  mounted: function () {
    this.getCharacters();
  },
});
</script>

<template>
  <div class="character-list">
    <div class="user-data">
      <h4>Player: {{ user.displayName || user.uid }}</h4>
      <button @click="signout()">Sign Out</button>
    </div>
    <h3>{{ error }}</h3>
    <div class="character-create">
      <input placeholder="new character name" v-model="newCharacterName" />
      <button @click="createCharacter()">create character</button>
    </div>
    <div class="character" v-for="character in characters">
      <div class="character-data">
        <p>character name: {{ character.characterName }}</p>
        <p>mapId: {{ character.mapId }}</p>
      </div>
      <button @click="connect(character.characterName)">Connect</button>
    </div>

    <!-- i am character list
    <input type="text" v-model="playerName" />
    <button @click="connect()">connect</button> -->
  </div>
</template>

<style scoped>
.character-list {
  width: 1024px;
  height: 720px;
  text-align: center;
}
.user-data {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 50%;
  margin: auto;
  margin-bottom: 20px;
}
.character {
  padding: 10px;
  border: 1px solid black;
  border-radius: 5px;
  width: 50%;
  margin: auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.character-create > * {
  height: 30px;
}
</style>
