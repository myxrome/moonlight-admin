<template lang="pug">
tr
  td.scenario-row
    .switch.tiny
      input.switch-input(:id='scenario.data.id' ref='active' type='checkbox' :checked='scenario.data.active' @change='activate')
      label.switch-paddle(:for='scenario.data.id')
  td
    router-link(:to='"/scenarios/" + scenario.data.id')
      i.fi-list-thumbnails
  td {{ scenario.data.title }}
  td(style='white-space: pre-wrap') {{ scenario.data.description }}
  td
    a(href='#' @click.prevent='$emit("switch")')
      i.fi-pencil
  td
    a(href='#' @click.prevent='goaway')
      i.fi-trash
</template>

<script>
import {mapActions} from 'vuex'

export default {
    props: {
        scenario: Object
    },
    methods: {
        ...mapActions([
            'update',
            'destroy'
        ]),
        activate() {
            this.update({
                id: this.scenario.id,
                active: this.$refs.active.checked
            });
        },
        goaway() {
            if (confirm('Delete this scenario?')) {
                this.destroy(this.scenario.id);
            }
        },
    }
}
</script>