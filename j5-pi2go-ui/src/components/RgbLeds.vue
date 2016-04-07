<template>
  <div class="mdl-grid leds-form">
    <h5 class="mdl-cell mdl-cell--12-col title">{{position}} leds</h5>
     <mdl-textfield class="mdl-cell mdl-cell--4-col" floating-label="Color" type="color" :value.sync="myleds[position].color" @change="changeLeds | debounce 50"></mdl-textfield>
     <div class="mdl-cell mdl-cell--8-col">
     <label class="title"><i class="material-icons">brightness_medium</i></label>
      <mdl-slider @input="changeLeds | debounce 50" :value.sync="myleds[position].intensity" min="0" max="100"></mdl-slider> 

    </div>
  </div>
</template>

<script>
import * as actions from '../vuex/actions'
import {pi2go} from '../pi2go/pi2go'
import _ from 'lodash'

export default {

  props: ['position'],

  data () {
    return {
      myleds: _.cloneDeep(this.leds)
    }
  },

  vuex: {
    getters: {
      leds: function (state) {
        return state.leds
      }
    },
    actions
  },

  methods: {
    changeLeds: function () {
      pi2go.updateLeds(this.position, this.myleds[this.position].color, this.myleds[this.position].intensity)
    }
  }

}
</script>

<style>
  .title {
    text-align: center;
    color: rgba(0,0,0,.54)
  }
  label.title {
    text-aligh:center; 
    display:block;
    margin: 5px 0;
  }
</style>