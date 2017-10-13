<template lang="pug">
tr
  td.scenario-row
    .switch.tiny
      input.switch-input(:id='scenario.id' ref='active' type='checkbox' :checked='scenario.active' @change='activate')
      label.switch-paddle(:for='scenario.id')
  td {{ scenario.title }}
  td(style='white-space: pre-wrap') {{ scenario.description }}
  td.handle
    img(:src='arrowsIcon')
  td
    a(href='#' @click.prevent='$emit("switch")')
      i.fi-pencil
  td
    a(href='#' @click.prevent='goaway')
      i.fi-x
</template>

<script>
import {mapActions} from 'vuex'
import arrowsIcon from '../../images/arrows.png'

export default {
    data: function () {
        return {
            arrowsIcon
        };
    },
    props: {
        scenario: Object
    },
    methods: {
        ...mapActions([
            'update',
            'erase'
        ]),
        activate() {
            this.update({
                id: this.scenario.id,
                active: this.$refs.active.checked
            });
        },
        goaway() {
            if (confirm('Delete this scenario?')) {
                this.erase(this.scenario);
            }
        },
    }
}
</script>