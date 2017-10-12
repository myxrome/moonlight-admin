<template lang="pug">
#scenarios
  table
    thead
      tr
        th.switch-column Active
        th(style='width: 20%') Title
        th Description
        th.button-column
        th.button-column
        th.button-column
    draggable(v-model="scenarios" element="tbody" :options="{handle: '.handle', draggable: '.draggable'}" )
      tr.draggable(is='table-row' v-for='scenario in scenarios' :scenario='scenario' :key='scenario.id')
      tr(is='edit-scenario-row'  v-for='scenario in newScenarios' :scenario='scenario' :key='scenario.id' @switch='newDone(scenario)')
  a.float-right(href='#' @click.prevent='addNew')
    i.fi-page-add
</template>

<script>
import { mapActions } from 'vuex'
import { mapGetters } from 'vuex'
import draggable from 'vuedraggable'
import EditScenarioRow from './edit_scenario_row.vue'
import ScenarioLine from './scenario_line.vue'
import TableRow from './table_row.vue'

export default {
  data: function () {
    return {
      newScenarios: []
    }
  },
  computed: {
    scenarios: {
      get() {
        return this.$store.getters.list
      },
      set(value) {
        this.reorder(value);
      }
    }
  },
  components: {
    draggable,
    EditScenarioRow,
    'table-row': {
      extends: TableRow,
      components: {
        'first-component': ScenarioLine,
        'second-component': EditScenarioRow
      }
    }
  },
  methods: {
    ...mapActions([
      'upload',
      'reorder'
    ]),
    addNew() {
      this.newScenarios.push({
        id: -(this.newScenarios.length + 1),
        title: '',
        description: '',
        active: false
      });
    },
    newDone(scenario) {
      this.newScenarios = this.newScenarios.filter(function (item) {
        return item.id !== scenario.id;
      })
    },
  },
  mounted: function() {
    this.upload();
  }
}
</script>