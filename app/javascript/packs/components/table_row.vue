<template lang="pug">
component(:is='currentView' @switch='switchView' :scenario='scenario')
</template>

<script>
export default {
  props: {
    scenario: Object
  },
  data: function() {
    return {
      currentView: 'first-component'
    }
  },
  methods: {
    switchView: function() {
      this.currentView = this.currentView === 'first-component' ? 'second-component' : 'first-component'
    }
  }
}
</script>