<template lang="haml">
%table
  %thead
    %tr
      %th.switch-column Active
      %th{style: 'width: 20%'} Title
      %th Description
      %th.button-column
  %tbody
    %tr{is: 'table-row', 'v-for': 'scenario in scenarios', ':scenario': 'scenario', ':key': 'scenario.id'}
</template>

<script>
import { mapActions } from 'vuex'
import { mapGetters } from 'vuex'
import EditScenarioRow from './edit_scenario_row.vue'
import ScenarioLine from './scenario_line.vue'
import TableRow from './table_row.vue'

export default {
  components: {
    'table-row': {
      extends: TableRow,
      components: {
        'first-component': ScenarioLine,
        'second-component': EditScenarioRow
      }
    }
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