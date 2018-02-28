<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <ul>
      <li v-bind:key="process.name" v-for="process in processes">
        {{ process.displayName }}
      </li>
    </ul>
  </div>
</template>

<script>
import fetchProcesses from '../../../common/api/src/fetchProcesses.js'

export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Hello world with Vuejs',
      processes: []
    }
  },
  created () {
    // fetch the data when the view is created and the data is already being observed
    fetchProcesses().then((processes) => { this.processes = processes })
  }
}
</script>

<style>
  h1 {
    font-size: 40px;
    text-align: center;
  }
</style>
