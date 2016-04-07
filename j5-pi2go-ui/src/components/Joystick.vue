<template>
  <div class="mdl-grid leds-form">
    <h5 class="mdl-cell mdl-cell--12-col title">Move</h5>
    <div class='mdl-cell mdl-cell--12-col joystick' id='joystick'>
    </div>
    <div class='mdl-cell mdl-cell--12-col'>
    L: {{ jL }} R: {{ jR }}
    </div>
  </div>
</template>

<script>
import * as actions from '../vuex/actions'
import {pi2go} from '../pi2go/pi2go'
import nipplejs from 'nipplejs'
import _ from 'lodash'

export default {

  props: ['position'],

  data () {
    return {
      jL: 0,
      jR: 0
    }
  },

  vuex: {
    actions
  },

  methods: {
    changeLeds: function () {
      pi2go.updateLeds(this.position, this.myleds[this.position].color, this.myleds[this.position].intensity)
    }
  },

  attached: function () {
    console.log('Created!!!')
    const nipple = nipplejs.create({
      zone: document.getElementById('joystick'),
      mode: 'static',
      position: {left: '50%', top: '50%'},
      color: 'red'
    })

    const me = this

    function sendMotorGo () {
      console.log('me.jL: ' + me.jL + '  me.jR: ' + me.jR)
      pi2go.motorGo(me.jL, me.jR)
    }

    nipple.on('move end', _.throttle(
      function (evt, data) {
        if (evt.type === 'move') {
          me.jL = Math.min(Math.max(parseInt(Math.cos(data.angle.radian - 0.7853981633974483) * data.distance * 2 * 1.4142135623730951), -100), 100)
          me.jR = Math.min(Math.max(parseInt(Math.sin(data.angle.radian - 0.7853981633974483) * data.distance * 2 * 1.4142135623730951), -100), 100)
        } else if (evt.type === 'end') {
          me.jL = 0
          me.jR = 0
        }

        sendMotorGo()
      },
      500)
    )
  }

}
</script>

<style>
  .title {
    text-align: center;
    color: rgba(0,0,0,.54)
  }
  .joystick {
    height: 100px;
    position: relative;
  }
</style>