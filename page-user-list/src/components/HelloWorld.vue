<template>
  <div>
    <ol>
      <li v-for="user in users" :key="user.id">
        {{ user.userName }}
      </li>
    </ol>
  </div>
</template>

<script>
export default {
  name: "UserList",
  props: {
    users: Array
  }
};
</script>
