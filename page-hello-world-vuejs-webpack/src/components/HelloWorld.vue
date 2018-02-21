<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <ul>
      <li v-bind:key="process.name" v-for="process in processes">
        {{ process.name }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Hello world with Vuejs',
      processes: [
        { name: 'process1' },
        { name: 'process2' }
      ]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}
</style>
