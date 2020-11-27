<template>
  <div id="app">
    <HelloWorld />
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";

export default {
  name: "app",
  components: {
    HelloWorld,
  },
};
</script>

<style>
#app {
  color: #2c3e50;
  margin-top: 60px;
}
</style>
