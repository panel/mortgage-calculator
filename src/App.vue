<template>
  <div id="app">
    <div id="overlay" v-show="showOverlay"></div>
    <header>
      <span>Mortgage Estimator</span>
    </header>
    <main class="container">
      <div class="row">
        <assets class="col-lg-3"></assets> 
        <payment class="col-lg-3"></payment>
        <calculations class="col-lg-5"></calculations>

        <history v-if="showHistory"/> 
      </div>
    </main>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import Assets from './components/Assets'
import Payment from './components/Payment'
import Calculations from './components/Calculations'
import History from './components/History'

export default {
  name: 'app',
  components: {
    Assets,
    Payment,
    Calculations,
    History
  },
  computed: {
    showHistory () {
      return !!Object.keys(this.history).length
    },
    showOverlay () {
      return !this.user
    },
    ...mapState([
      'history',
      'user'
    ])
  }
}
</script>

<style>
body {
  margin: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

header {
  margin: 0;
  height: 56px;
  padding: 0 24px 0 48px;
  background-color: #35495E;
  color: #ffffff;
}

header span {
  display: block;
  position: relative;
  font-size: 20px;
  line-height: 1;
  letter-spacing: .02em;
  font-weight: 400;
  box-sizing: border-box;
  padding-top: 16px;
}

fieldset {
  border: 1px solid #ccc;
  margin: 0.5em;
}

legend {
  text-align: center;
  width: 50%;
}

input[type=number] {
  text-align: right;
}

#overlay {
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0,0,0,0.75);

  height: 100%;
  width: 100%;

  z-index: 9999;
}
</style>
