<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  data() {
    return {
      alerts: 0,
    };
  },
  props: {
    alertType: String,
  },
  methods: {
    addAlert() {
      if (!this.alerts) this.alerts = 0;
      this.alerts++;
    },
    clearAlerts() {
      this.alerts = 0;
    },
  },
  mounted() {
    window.addEventListener("alert:" + this.alertType, () => {
      this.addAlert();
    });
  },
});
</script>

<template>
  <div v-if="alerts" class="alert-bubble">
    <p>{{ alerts }}</p>
  </div>
</template>
<style scoped>
.alert-bubble p {
  font-size: 2em;
  color: white;
}
.alert-bubble {
  display: flex;
  align-items: center;
  justify-content: center;
  background: red;
  width: 25px;
  height: 25px;
  border-radius: 100%;
  font-size: 10px;
  border: 4px solid pink;
  position: absolute;
  right: -20px;
  top: -25px;
  animation: vibrate 500ms Infinite alternate;
}
@keyframes bop-up {
  100% {
    transform: translateY(-10%);
  }
}

@keyframes vibrate {
  50% {
    transform: rotate(10deg);
  }
  100% {
    transform: rotate(-10deg);
  }
}
</style>
