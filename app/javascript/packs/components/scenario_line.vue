<template lang="haml">
%tr
  %td.switch-container
    .switch.tiny
      %input.switch-input{':id': 'scenario.id', type: 'checkbox', ':checked': 'scenario.active', '@change': 'activate(scenario.id, $event.target.checked)'}
      %label.switch-paddle{':for': 'scenario.id'}
  %td {{ scenario.title }}
  %td {{ scenario.description }}
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
    activate(id, value) {
      this.update({id: id, active: value});
    }
  }
}
</script>