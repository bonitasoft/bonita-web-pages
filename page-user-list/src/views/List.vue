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
  <div id="user-list">
    <user-table :users="users" :pagination="pagination" :order="order" @refresh="updateRoute()"/>
  </div>
</template>

<script>
import UserTable from '../components/UserTable.vue';
import api from '../api/UserAPI';
import Pagination from "../common/Pagination";
import Order from "../common/Order";
import router from '../router';

export default {
  name: 'List',
  components: {
    'user-table': UserTable
  },
  props: {
    page: String,
    items: String,
    sortBy: String,
    sortOrder: String
  },
  data: function() {
    return {
      users: [],
      order: new Order(this.sortBy, this.sortOrder),
      pagination: new Pagination (this.page, this.items)
    };
  },
  methods:{
    updateRoute: function() {
      router.push({ path: '/users',
        query: {
          page: this.pagination.page.toString(),
          items: this.pagination.size.toString(),
          sortBy: this.order.sortBy,
          sortOrder: this.order.sortOrder
        }
      });
      this.getUsers();
    },
    getUsers: function() {
      api.getUsers(this.pagination, this.order).then((response) => {
        this.users = response.data;
        this.pagination = response.pagination;
      });
    }
  },
  mounted: function() {
    this.getUsers();
  }
};
</script>
