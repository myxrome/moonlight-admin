<template lang="pug">
#scenarios
    ul.breadcrumbs
        li.current Scenarios
    table
        thead
            tr
                th.switch-column Active
                th.button-column
                th(style='width: 20%') Title
                th Description
                th.button-column
                th.button-column
        draggable(element="tbody" :options="{filter: 'a, input, textarea, .switch', preventOnFilter: false, draggable: '.draggable-item', dragClass: 'draggable-ghost', chosenClass: 'draggable-chosen'}" @end='onEnd' )
            tr.draggable-item(is='table-row' v-for='scenario in scenarios' :scenario='scenario' :key='scenario.id')
            tr(is='edit-scenario-row'  v-for='scenario in newScenarios' :scenario='scenario' :key='scenario.id' @switch='newDone(scenario)')
    a.float-right(href='#' @click.prevent='addNew')
        i.fi-plus
</template>

<script>
import {mapActions} from 'vuex'
import {mapGetters} from 'vuex'
import draggable from 'vuedraggable'
import EditScenarioRow from './edit_scenario_row.vue'
import ScenarioLine from './scenario_line.vue'
import TableRow from './table_row.vue'

export default {
    data: function () {
        return {
            newScenarios: [],
        }
    },
    computed: {
        ...mapGetters({
            scenarios: 'getAllScenarios'
        })
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
            'fetch',
            'move',
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
        onEnd(event) {
            this.move({from: event.oldIndex, to: event.newIndex});
        },
    },
    created: function () {
        this.fetch();
    },
}
</script>