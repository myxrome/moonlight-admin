<template lang="haml">
%tr
  %td.scenario-row
    .switch.tiny
      %input.switch-input{':id': 'scenario.id', type: 'checkbox', ':checked': 'scenario.active', '@change': 'activate(scenario.id, $event.target.checked)'}
      %label.switch-paddle{':for': 'scenario.id'}
  %td
    %input{name: 'title', ':value': 'scenario.title', type: 'text'}
  %td
    %textarea{name: 'description', ':value': 'scenario.description', type: 'text', rows: '1'}
  %td
    %a{href: '#', '@click.prevent': '$emit("switch")'}
      %i.fi-x-circle
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