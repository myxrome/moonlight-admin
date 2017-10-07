<template lang="haml">
%table
  %thead
    %tr
      %td Active
      %td Title
      %td Description
  %tbody
    %tr{is: 'scenario-line', 'v-for': 'scenario in scenarios', ':scenario': 'scenario', ':key': 'scenario.id'}
</template>

<script>
import { mapActions } from 'vuex'
import { mapGetters } from 'vuex'
import ScenarioLine from './scenario_line.vue'

export default {
  components: {
    ScenarioLine
  },
  computed: mapGetters({
    scenarios: 'list'
  }),
  methods: {
    ...mapActions([
      'upload'
    ])
  },
  mounted: function() {
    this.upload();
  }
}
</script>