<template>
  <div id="app">
    <UserTable :users="users"/>
  </div>
</template>

<script>
import UserTable from './components/UserTable.vue';
import api from './api/UserAPI.js';
export default {
  name: 'app',
  components: {
    UserTable
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
