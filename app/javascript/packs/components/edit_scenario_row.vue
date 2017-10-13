<template lang="pug">
tr
  td.scenario-row
    .switch.tiny(v-if='this.scenario.id > 0')
      input.switch-input(:id='scenario.id' ref='active' type='checkbox' :checked='scenario.active' @change='activate')
      label.switch-paddle(:for='scenario.id')
  td
    input(ref='title' type='text' :value='scenario.title')
  td
    textarea(ref='description' type='text' rows='1' :value='scenario.description')
  td(:class='{ handle: this.scenario.id > 0 }')
    img(:src='arrowsIcon' v-if='this.scenario.id > 0')
  td
    a(href='#' @click.prevent='save')
      i.fi-save
  td
    a(href='#' @click.prevent='$emit("switch")')
      i.fi-prohibited
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
                    active: false,
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