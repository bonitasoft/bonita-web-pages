<!--
/**
* Copyright (C) 2018 Bonitasoft S.A.
* Bonitasoft, 32 rue Gustave Eiffel - 38000 Grenoble
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 2.0 of the License, or
* (at your option) any later version.
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU General Public License for more details.
* You should have received a copy of the GNU General Public License
* along with this program. If not, see <http://www.gnu.org/licenses/>.
*/
-->
<template>
  <div>
     <b-table ref="usersTable" striped hover :sort-by.sync="order.sortBy" :sort-desc.sync="order.sortDesc" :no-local-sorting="true" :items="users" :fields="fields" @sort-changed="sortingChanged"></b-table>
     <b-pagination :total-rows="pagination.total" :per-page="pagination.size" v-model="pageIndex" @input="$emit('refresh')" />
  </div>
</template>

<script>
  export default {
    name: 'UserTable',
    props: {
      users: Array,
      pagination: Object,
      order: Object
    },
    data: function() {
      return {
        fields: [
          { key: 'userName', sortable: true },
          { key: 'lastname', sortable: true },
          { key: 'firstname', sortable: true },
          { key: 'job_title', sortable: false },
          { key: 'last_connection', sortable: false }
        ]
      };
    },
    methods: {
      sortingChanged: function(ctx) {
        this.order.sortBy = ctx.sortBy;
        this.order.sortDesc = ctx.sortDesc;
        this.order.sortOrder = ctx.sortDesc ? 'DESC' : 'ASC';
        this.$emit('refresh');
      }
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
