<template>
  <div id="app">
    <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
      <page-header></page-header>
    
      <main class="mdl-layout__content  mdl-color--grey-100">
        <div class="page-content">        
          <div class="mdl-grid mdl-grid--no-spacing">
            <div class="mdl-cell mdl-cell--9-col mdl-cell--8-col-tablet">
              <div class="mdl-grid">
                <div class="mdl-cell mdl-cell--3-col mdl-cell--3-offset mdl-color--white mdl-shadow--2dp" style="padding:10px">
                  <rgb-leds position="front"></rgb-leds>
                </div>
              </div>
              <div class="mdl-grid">
                <div class="mdl-cell mdl-cell--3-col mdl-color--white mdl-shadow--2dp" style="padding:10px">
                  <rgb-leds position="left"></rgb-leds>
                </div>
                <div class="mdl-cell mdl-cell--3-col mdl-color--white mdl-shadow--2dp" style="padding:10px">
                  <joystick position="right"></joystick>
                </div>
                <div class="mdl-cell mdl-cell--3-col mdl-color--white mdl-shadow--2dp" style="padding:10px">
                  <rgb-leds position="right"></rgb-leds>
                </div>
              </div>
              <div class="mdl-grid">
                <div class="mdl-cell mdl-cell--3-col mdl-cell--3-offset mdl-color--white mdl-shadow--2dp" style="padding:10px">
                  <rgb-leds position="back"></rgb-leds>
                </div>

                <!--div class="mdl-cell mdl-cell--12-col mdl-color--white mdl-shadow--2dp">
                  <img class="logo" src="./assets/logo.png">
                  <hello></hello>
                  <p>Pi2Go is {{ pi2go.state }} </p>
                </div-->
              </div>
            </div>
            <div class="mdl-cell mdl-cell--3-col mdl-cell--4-col-tablet">
              <debug-panel></debug-panel>
            </div>
            
          </div>

        </div>
      </main>   
    </div> 
  </div>
</template>

<script>
import PageHeader from './components/PageHeader'
import DebugPanel from './components/DebugPanel'
import RgbLeds from './components/RgbLeds'
import Joystick from './components/Joystick'
// import Hello from './components/Hello'
import pi2go from './pi2go/pi2go'

export default {
  components: {
    PageHeader,
    DebugPanel,
    RgbLeds,
    Joystick,
    pi2go
  },

  methods: {

    turnOff () {
      // pi2go.turnOff()
    }
  }
}

</script>

<style>
html {
  height: 100%;
}

body {
  height: 100%;
}

main {
  width: 100%;
}

.logo {
  width: 100px;
  height: 100px
}
</style>
