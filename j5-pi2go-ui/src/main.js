import Vue from 'vue'
import App from './App'

import Vuex from 'vuex'
import store from './vuex/store'

var ch = require('exports?componentHandler!material-design-lite/material.js')
ch.upgradeDom()

import vmdl from 'vue-mdl'

Vue.use(Vuex)

vmdl.registerAll(Vue)

/* eslint-disable no-new */
new Vue({
  el: 'body',
  components: {
    App
  },
  store
})
