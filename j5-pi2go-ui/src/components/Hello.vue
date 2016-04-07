<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <a @click="getFullState">GET STATE</a>
  </div>
</template>

<script>
// import { pi2go } from '../pi2go'

export default {
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      msg: 'Hello World!'
    }
  },

  methods: {
    getFullState () {
      // pi2go.getFullState()
    }
  }
}
</script>
