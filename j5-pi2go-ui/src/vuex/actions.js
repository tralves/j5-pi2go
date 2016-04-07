// export const incrementCounter = function ({ dispatch, state }) {
//   dispatch('INCREMENT', 1)
// }

//   export const getFullState = function() {
//     socket.emit('get full state')
//   },

//   turnOff () {
//     this.pi2go.state = 'off'
//   }

export const updateSensorValue = function (store, sensor, value) {
  console.log(store)
  store.dispatch('UPDATE_SENSOR', sensor, value)
}

export const updateAllSensors = function (store, values) {
  store.dispatch('UPDATE_ALL_SENSORS', values)
}

export const updateConnectionStatus = function (store, status) {
  store.dispatch('UPDATE_CONNECTION_STATUS', status)
}
