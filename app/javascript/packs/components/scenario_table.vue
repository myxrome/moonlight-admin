<template lang="pug">
#scenarios
    ul.breadcrumbs
        li.current Scenarios
    table-template.scenario-table(:items='scenarios' :newItems='newScenarios' :options='{draggable: true}' @onDragEnd='onEnd')
        template(slot='thead')
            th.button-column
            th.switch-column Active
            th(style='width: 20%') Title
            th Description
        template(slot='show-row-table' slot-scope='{ item }')
            td
                router-link(:to='"/scenarios/" + item.data.id')
                    i.fi-list-thumbnails
            td
                value-switcher(:item='item.data' :value='item.data.active' @switch='onActive')
            td {{ item.data.title }}
            td(style='white-space: pre-wrap') {{ item.data.description }}
        template(slot='edit-row-table' slot-scope='{ item }')
            td
                router-link(:to='"/scenarios/" + item.data.id')
                    i.fi-list-thumbnails
            td
                value-switcher(:item='item.data' :value='item.data.active' @switch='onActive')
            td
                input(type='text' :value='item.data.title' @keyup.stop='$store.commit("UPDATE_SCENARIO_CACHE", {id: item.data.id, field: "title", value: $event.target.value})')
            td
                textarea(type='text' rows='1' :value='item.data.description' @keyup.stop='$store.commit("UPDATE_SCENARIO_CACHE", {id: item.data.id, field: "description", value: $event.target.value})')
        template(slot='new-row-table' slot-scope='{ item }')
            td
            td
            td
                input(type='text' :value='item.cache.title' @keyup.stop='$store.commit("UPDATE_SCENARIO_CACHE", {id: item.data.id, field: "title", value: $event.target.value})')
            td
                textarea(type='text' rows='1' :value='item.cache.description' @keyup.stop='$store.commit("UPDATE_SCENARIO_CACHE", {id: item.data.id, field: "description", value: $event.target.value})')
</template>

<script>
import {mapActions} from 'vuex'
import {mapGetters} from 'vuex'
import Draggable from 'vuedraggable'
import EditScenarioRow from './edit_scenario_row.vue'
import ScenarioLine from './scenario_line.vue'
import TableRow from './table_row.vue'

import ValueSwitcher from './value_switcher.vue'
import ItemShowRow from './table/item_show_row.vue'

import TableTemplate from './table/table_template.vue'
import scenarios from "../store/modules/scenarios";

export default {
    computed: {
        ...mapGetters({
            scenarios: 'getScenarios',
            newScenarios: 'getNewScenarios',
        })
    },
    components: {
        TableTemplate,
        ValueSwitcher,
    },
    methods: {
        ...mapActions([
            'fetch',
            'move',
            'update',
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
        onActive(scenario, value) {
            console.log("switch scenario " + scenario.title + " to " + value);
            this.update({
                id: scenario.id,
                active: value
            });
        },
    },
    created: function () {
        this.fetch();
    },
}
</script>