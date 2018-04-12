<template>
  <div>
     <b-table striped hover :items="users" :fields="fields"></b-table>
  </div>
</template>

<script>
export default {
  name: 'UserTable',
  props: {
    users: Array
  },
  data() {
    return {
      fields: [
        'userName',
        'lastname',
        'firstname',
        'job_title',
        'last_connection'
      ]
    };
  }
};
</script>
