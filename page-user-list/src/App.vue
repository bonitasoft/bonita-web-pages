<template>
  <div id="app">
    <UserTable :users="users" :pagination="pagination" @refresh="getUsers()"/>
  </div>
</template>

<script>
import UserTable from "./components/UserTable.vue";
import api from "./api/UserAPI.js";
import Pagination from './common/Pagination';
export default {
  name: "app",
  components: {
    UserTable
  },
  data: function() {
    return {
      users: [],
      pagination: {
        page:0,
        size:10
      }
    };
  },
  methods:{
    getUsers () {
      api.getUsers(this.pagination).then((response) => {
        this.users = response.data;
        this.pagination = response.pagination;
      });
    }
  },
  mounted: function () {
    this.getUsers();
  }
};
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
