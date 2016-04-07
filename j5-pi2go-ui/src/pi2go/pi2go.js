import io from 'socket.io-client'
import * as actions from '../vuex/actions'
import store from '../vuex/store'
// import _ from 'lodash'

const PI2GO_HOST = 'http://raspberrypi.local'
const PI2GO_PORT = 8080

console.log('creating socket')
let socket = io(PI2GO_HOST + ':' + PI2GO_PORT)

const listeners = [
  'obstacle left',
  'obstacle center',
  'obstacle right',

  'line left',
  'line right',

  'light frontLeft',
  'light frontRight',
  'light backLeft',
  'light backRight',

  'button',

  'proximity'
]

export const pi2go = {

  getFullState () {
    socket.emit('get full state')
  },

  updateLeds (position, color, intensity) {
    console.log('sending set leds ' + position + ' ' + color + ' ' + intensity)
    socket.emit('set leds', {
      position,
      color,
      intensity
    })
  },

  motorGo (left, right) {
    console.log('sending motorsGo ' + left + ' ' + right)
    socket.emit('motor go', {
      left,
      right
    })
  }
}

Array.from(listeners).forEach(function (listener) {
  socket.on(listener, function (msg) {
    console.log('listener: ' + msg)
    actions.updateSensorValue(store, listener, msg)
  })
})

socket.on('full state', function (msg) {
  console.log('PI2GO got:')
  console.log(msg)
  actions.updateAllSensors(store, msg)
  // _.assign(pi2go.pi2go, msg)
})

socket.on('connect', function () {
  console.log('Connected!')
  actions.updateConnectionStatus(store, true)
  pi2go.getFullState()
})

socket.on('disconnect', function () {
  console.log('Disconnected!')
  actions.updateConnectionStatus(store, false)
})
