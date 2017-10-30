<template lang="pug">
#scenarios
    ul.breadcrumbs
        li.current Scenarios
    table-template.scenario-table(:storedItems='storedScenarios' :newItems='newScenarios' :draggable='true'
                                    @switchRow='onSwitchScenarioRow'
                                    @saveStoredItem='onSaveStoredScenario'
                                    @removeStoredItem='onRemoveStoredScenario'
                                    @addNewItem='onAddNewScenario'
                                    @saveNewItem='onSaveNewScenario'
                                    @removeNewItem='onRemoveNewScenario'
                                    @dragEnd='onDragEnd')
        template(slot='thead')
            th.button-column
            th.switch-column Active
            th(style='width: 20%') Title
            th Description
        template(slot='show-row' slot-scope='{ item }')
            td
                router-link(:to='"/scenarios/" + item.data.id')
                    i.fi-list-thumbnails
            td
                value-switcher(:item='item.data' :value='item.data.active' @switch='onSwitchStoredScenarioActive')
            td {{ item.data.title }}
            td(style='white-space: pre-wrap') {{ item.data.description }}
        template(slot='edit-row' slot-scope='{ item }')
            td
                router-link(:to='"/scenarios/" + item.data.id')
                    i.fi-list-thumbnails
            td
                value-switcher(:item='item.data' :value='item.data.active' @switch='onSwitchStoredScenarioActive')
            td
                input(type='text' :value='item.data.title' @keyup.stop='onUpdateStoredScenarioCache(item.data.id, "title", $event.target.value)')
            td
                textarea(type='text' rows='1' :value='item.data.description' @keyup.stop='onUpdateStoredScenarioCache(item.data.id, "description", $event.target.value)')
        template(slot='new-row' slot-scope='{ item }')
            td
            td
            td
                input(type='text' :value='item.cache.title' @keyup.stop='onUpdateNewScenarioCache(item.data.id, "title", $event.target.value)')
            td
                textarea(type='text' rows='1' :value='item.cache.description' @keyup.stop='onUpdateNewScenarioCache(item.data.id, "description", $event.target.value)')
</template>

<script>
    import * as mutations from '../../store/mutation_types'
    import * as actions from '../../store/action_types'
    import {mapGetters} from 'vuex'

    import TableTemplate from '../common/table/table_template.vue'
    import ValueSwitcher from '../common/value_switcher.vue'

    export default {
        computed: {
            ...mapGetters({
                storedScenarios: 'getStoredScenarios',
                newScenarios: 'getNewScenarios',
            })
        },
        components: {
            TableTemplate,
            ValueSwitcher,
        },
        methods: {
            onSwitchScenarioRow(id) {
                this.$store.commit(mutations.SWITCH_STORED_SCENARIO_STATE, id);
            },
            onSaveStoredScenario(id) {
                const item = this.$store.getters.getStoredScenarioById(id);
                this.$store.dispatch(actions.UPDATE_SCENARIO,
                                     Object.assign({id: id}, item.cache)).then(() => {
                    this.$store.commit(mutations.SWITCH_STORED_SCENARIO_STATE, id);
                });
            },
            onRemoveStoredScenario(id) {
                const item = this.$store.getters.getStoredScenarioById(id);
                if (confirm(`Delete "${item.data.title}" scenario?`)) {
                    this.$store.dispatch(actions.DESTROY_SCENARIO, id);
                }
            },
            onAddNewScenario() {
                this.$store.commit(mutations.ADD_NEW_SCENARIO, {
                    id: -Math.floor(Math.random() * 1000000 + 1),
                    title: '',
                    description: '',
                    active: false,
                });
            },
            onSaveNewScenario(id) {
                const item = this.$store.getters.getNewScenarioById(id);
                this.$store.dispatch(actions.CREATE_SCENARIO,
                    Object.assign({order: this.storedScenarios.length, active: false}, item.cache)).then(() => {
                    this.$store.commit(mutations.REMOVE_NEW_SCENARIO, id);
                });
            },
            onRemoveNewScenario(id) {
                this.$store.commit(mutations.REMOVE_NEW_SCENARIO, id);
            },
            onDragEnd(event) {
                this.$store.dispatch(actions.MOVE_SCENARIO, {from: event.oldIndex, to: event.newIndex});
            },
            onSwitchStoredScenarioActive(scenario, value) {
                this.$store.dispatch(actions.UPDATE_SCENARIO, {
                    id: scenario.id,
                    active: value
                });
            },
            onUpdateStoredScenarioCache(id, field, value) {
                const item = this.$store.getters.getStoredScenarioById(id);
                let data = Object.assign({id: id}, item.cache);
                data[field] = value;
                this.$store.commit(mutations.UPDATE_STORED_SCENARIO_CACHE, data);
            },
            onUpdateNewScenarioCache(id, field, value) {
                const item = this.$store.getters.getNewScenarioById(id);
                let data = Object.assign({id: id}, item.cache);
                data[field] = value;
                this.$store.commit(mutations.UPDATE_NEW_SCENARIO_CACHE, data);
            },
        },
        created: function () {
            this.$store.dispatch(actions.REQUEST_SCENARIOS);
        },
    }
</script>