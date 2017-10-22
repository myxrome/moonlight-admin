<template lang="pug">
tr
  td.scenario-row
    .switch.tiny(v-if='this.scenario.data.id > 0')
      input.switch-input(:id='scenario.data.id' ref='active' type='checkbox' :checked='scenario.data.active' @change='activate')
      label.switch-paddle(:for='scenario.data.id')
  td
    router-link(:to='"/scenarios/" + scenario.data.id' v-if='this.scenario.id > 0')
      i.fi-list-thumbnails
  td
    input(ref='title' type='text' :value='scenario.data.title')
  td
    textarea(ref='description' type='text' rows='1' :value='scenario.data.description')
  td
    a(href='#' @click.prevent='save')
      i.fi-check
  td
    a(href='#' @click.prevent='$emit("switch")')
      i.fi-x
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
            'create'
        ]),
        activate() {
            this.update({
                id: this.scenario.id,
                active: this.$refs.active.checked
            });
        },
        save() {
            if (this.scenario.id < 0) {
                this.create({
                    title: this.$refs.title.value,
                    description: this.$refs.description.value,
                }).then(() => {
                    this.$emit("switch");
                });
            } else {
                this.update({
                    id: this.scenario.id,
                    title: this.$refs.title.value,
                    description: this.$refs.description.value
                }).then(() => {
                    this.$emit("switch");
                });
            }
        }
    }
}
</script>