<script lang="ts">
import { defineComponent } from "vue";
import { MUTATION_TYPE } from "../types";

export default defineComponent({
  computed: {
    showAlert: function () {
      return this.$store.state.alertContent.length > 0;
    },
    alertContent: function () {
      return this.$store.state.alertContent;
    },
  },
  methods: {
    acceptAlert: function () {
      this.$store.commit(MUTATION_TYPE.setAlert, "");
    },
  },
});
</script>

<template>
  <div class="alert-box" v-if="showAlert">
    <div class="container">
      <h3>Alert</h3>
      <p>{{ alertContent }}</p>
      <button @click="acceptAlert">OK</button>
    </div>
  </div>
</template>

<style scoped>
.alert-box {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 9;
  display: grid;
  align-items: center;
}

.container {
  display: grid;
  align-content: center;
  align-items: center;
  grid-template-rows: 1fr 1fr 1fr;
  gap: 20px;
  grid-template-areas: ". title ." "content content content" ". ok .";
  background-color: rgb(132, 219, 219);
  margin: auto;
  border: 2px solid rgb(63, 133, 127);
}

h3 {
  grid-area: title;
  text-align: center;
}
p {
  grid-area: content;
  text-align: center;
}
button {
  grid-area: ok;
  height: 100%;
  width: 10vw;
  border-radius: 50px;
  font-size: x-large;
}
</style>
