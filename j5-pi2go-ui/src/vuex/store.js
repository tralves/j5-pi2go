import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'

// Make vue aware of vuex
Vue.use(Vuex)

const state = {
  state: 'off',
  button: 'no value',

  'connected': false,

  'obstacle': {
    'left': true,
    'center': undefined,
    'right': undefined
  },
  'line': {
    'left': undefined,
    'right': undefined
  },
  'light': {
    'frontLeft': undefined,
    'frontRight': undefined,
    'backLeft': undefined,
    'backRight': undefined
  },

  'leds': {
    front: {
      'color': '#FFFFFF',
      'intensity': 0
    },
    right: {
      'color': '#FFFFFF',
      'intensity': 0
    },
    back: {
      'color': '#FFFFFF',
      'intensity': 0
    },
    left: {
      'color': '#FFFFFF',
      'intensity': 0
    }
  },

  proximity: 5

}

const mutations = {
  UPDATE_SENSOR (state, sensor, value) {
    console.log('MUTATION UPDATE_SENSOR')
    _.set(state, _.replace(sensor, ' ', '.'), value)
  },

  UPDATE_ALL_SENSORS (state, values) {
    console.log('MUTATION UPDATE_ALL_SENSORS')
    _.assign(state, values)
  },

  UPDATE_CONNECTION_STATUS (state, status) {
    console.log('MUTATION UPDATE_CONNECTION_STATUS')
    state.connected = status
  }
}

export default new Vuex.Store({
  state,
  mutations
})
