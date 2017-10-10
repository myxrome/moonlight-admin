<template lang="pug">
tr
  td.scenario-row
    .switch.tiny
      input.switch-input(:id='scenario.id' ref='active' type='checkbox' :checked='scenario.active' @change='activate')
      label.switch-paddle(:for='scenario.id')
  td {{ scenario.title }}
  td(style='white-space: pre-wrap') {{ scenario.description }}
  td
    a(href='#' @click.prevent='$emit("switch")')
      i.fi-pencil
  td
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    scenario: Object
  },
  methods: {
    ...mapActions([
      'update'
    ]),
    activate() {
      this.update({
        id: this.scenario.id,
        active: this.$refs.active.checked
      });
    },
  }
}
</script>