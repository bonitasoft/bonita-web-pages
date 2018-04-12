<template>
  <div id="app">
    <HelloWorld :users="users" msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import api from "./api/UserAPI.js";
export default {
  name: "app",
  components: {
    HelloWorld
  },
  data: function() {
    return {
      users: []
    };
  },
  mounted: function() {
    api.getUsers().then(response => (this.users = response));
  }
};
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
