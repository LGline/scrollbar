<template>
  <div id="app">
    <home>
      <template slot="img">
        <img alt="Vue logo" src="./assets/logo.png">
        <img alt="Vue logo" src="./assets/logo.png">
        <img alt="Vue logo" src="./assets/logo.png">
        <img alt="Vue logo" src="./assets/logo.png">
        <img alt="Vue logo" src="./assets/logo.png">
        <img alt="Vue logo" src="./assets/logo.png">
        <img alt="Vue logo" src="./assets/logo.png">
        <img alt="Vue logo" src="./assets/logo.png">
        <img alt="Vue logo" src="./assets/logo.png">
        <img alt="Vue logo" src="./assets/logo.png">
      </template>
    </home>
  </div>
</template>

<script>
import home from './components/home.vue'

export default {
  name: 'app',
  components: {home}
}
</script>

<style>
body {height: 400px;}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
