<template>
<div class="debug-panel">
  <div class="mdl-grid">
    <h5>Debug data:</h5>
    <button id="debug-refresh" class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored" @click="getFullState">
      <i class="material-icons">refresh</i>
    </button>
  </div>
  <table id='debug-data' class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
    <thead>
      <tr>
        <th class="mdl-data-table__cell--non-numeric">Sensor</th>
        <th>Value</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="mdl-data-table__cell--non-numeric">Connected</td>
        <td>{{connected?'YES':'NO'}}</td>
      </tr>
      <tr>
        <td class="mdl-data-table__cell--non-numeric">Button</td>
        <td>{{button}}</td>
      </tr>
      <tr>
        <td class="mdl-data-table__cell--non-numeric">Obstacle Left</td>
        <td>{{obstacle.left?'YES':'NO'}}</td>
      </tr>
      <tr>
        <td class="mdl-data-table__cell--non-numeric">Obstacle Center</td>
        <td>{{obstacle.center?'YES':'NO'}}</td>
      </tr>
      <tr>
        <td class="mdl-data-table__cell--non-numeric">Obstacle Rigth</td>
        <td>{{obstacle.right?'YES':'NO'}}</td>
      </tr>

      <tr>
        <td class="mdl-data-table__cell--non-numeric">Line Left</td>
        <td>{{line.left?'YES':'NO'}}</td>
      </tr>
      <tr>
        <td class="mdl-data-table__cell--non-numeric">Line Rigth</td>
        <td>{{line.right?'YES':'NO'}}</td>
      </tr>

      <tr>
        <td class="mdl-data-table__cell--non-numeric">Light Front Left</td>
        <td>{{ light.frontLeft }}</td>
      </tr>
      <tr>
        <td class="mdl-data-table__cell--non-numeric">Light Front Right</td>
        <td>{{ light.frontRight }}</td>
      <tr>
        <td class="mdl-data-table__cell--non-numeric">Light Back Left</td>
        <td>{{ light.backLeft }}</td>
      </tr>
      <tr>
        <td class="mdl-data-table__cell--non-numeric">Light Back Right</td>
        <td>{{ light.backRight }}</td>
      </tr>
      <tr>
        <td class="mdl-data-table__cell--non-numeric">Proximity</td>
        <td>{{ proximity }}</td>
      </tr>
      <!--tr>
        <td class="mdl-data-table__cell--non-numeric">Led Front Intensity</td>
        <td>{{ leds.front.intensity }}</td>
      </tr-->
    </tbody>
  </table>
</div>
</template>

<script>
import {pi2go} from '../pi2go/pi2go'
// import * as getters from '../vuex/getters'

export default {
  data () {
    return {
      // pi2go: pi2go
    }
  },

  vuex: {
    getters: {
      button: state => state.button,
      obstacle: state => state.obstacle,
      light: state => state.light,
      line: state => state.line,
      connected: state => state.connected,
      leds: state => state.leds,
      proximity: state => state.proximity
    }
  },

  methods: {
    getFullState (event) {
      pi2go.getFullState()
      event.target.blur()
    }
  }
}
</script>
<style>
  .debug-panel {
  }

  #debug-data {
    width: 100%;
  }

  h5 {
    margin: 8px;
    font-size: 16px;
    color: rgba(0,0,0,.54);
    font-weight: 500;
    text-transform: uppercase;
  }

  #debug-refresh {
    margin-right: 0;
  }

</style>
