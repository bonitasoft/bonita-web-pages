<template>
  <div>
     <b-table ref="usersTable" striped hover :items="users" :fields="fields"></b-table>
     <b-pagination :total-rows="pagination.total" :per-page="pagination.size" v-model="pageIndex" @input="$emit('refresh')" />
  </div>
</template>

<script>
import Pagination from "../common/Pagination";
export default {
  name: "UserTable",
  props: {
    users: Array,
    pagination: Object
  },
  data() {
    return {
      fields: [
        "userName",
        "lastname",
        "firstname",
        "job_title",
        "last_connection"
      ]
    };
  },
  computed: {
    //pagination component starts at index 1, bonita apis starts at index 0
    pageIndex: {
      get: function() {
        return this.pagination.page + 1;
      },
      set: function(newValue) {
        this.pagination.page = newValue - 1;
      }
    }
  }
};
</script>
