<template lang="pug">
#scenarios
    ul.breadcrumbs
        li.current Scenarios
    table-template.scenario-table(:stored='stored' :added='added' :draggable='true'
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
        template(slot='stored-show-row' slot-scope='{ item }')
            td
                router-link(:to='"/scenarios/" + item.data.id')
                    i.fi-list-thumbnails
            td
                value-switcher(:item='item.data' :value='item.data.active' @switch='onSwitchStoredScenarioActive')
            td {{ item.data.title }}
            td(style='white-space: pre-wrap') {{ item.data.description }}
        template(slot='stored-edit-row' slot-scope='{ item }')
            td
                router-link(:to='"/scenarios/" + item.data.id')
                    i.fi-list-thumbnails
            td
                value-switcher(:item='item.data' :value='item.data.active' @switch='onSwitchStoredScenarioActive')
            td
                input(type='text' :value='item.data.title' @change='onUpdateStoredScenarioCache(item.data.id, "title", $event.target.value)')
            td
                textarea(type='text' rows='1' :value='item.data.description' @change='onUpdateStoredScenarioCache(item.data.id, "description", $event.target.value)')
        template(slot='added-row' slot-scope='{ item }')
            td
            td
            td
                input(type='text' :value='item.cache.title' @change='onUpdateNewScenarioCache(item.data.id, "title", $event.target.value)')
            td
                textarea(type='text' rows='1' :value='item.cache.description' @change='onUpdateNewScenarioCache(item.data.id, "description", $event.target.value)')
</template>

<script>
    import * as mutations from '../../store/mutation_types'
    import * as actions from '../../store/action_types'

    import TableTemplate from '../common/table/table_template.vue'
    import ValueSwitcher from '../common/value_switcher.vue'

    export default {
        computed: {
            stored: function () {
                return this.$store.state.scenarios.stored.
                    map(item => item).
                    sort((left, right) => left.data.order - right.data.order);
            },
            added: function () {
                return this.$store.state.scenarios.added;
            },
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
                const item = this.stored.find(item => item.data.id === id);
                if (Object.keys(item.cache).length !== 0) {
                    this.$store.dispatch(actions.UPDATE_SCENARIO,
                        Object.assign({id: id}, item.cache)).then(() => {
                    });
                }
                this.$store.commit(mutations.SWITCH_STORED_SCENARIO_STATE, id);
            },
            onRemoveStoredScenario(id) {
                const item = this.stored.find(item => item.data.id === id);
                if (confirm(`Delete "${item.data.title}" scenario?`)) {
                    this.$store.dispatch(actions.DESTROY_SCENARIO, id);
                    this.stored.
                        filter(el => el.data.order > item.data.order).
                        forEach(el =>
                            this.$store.dispatch(
                                actions.UPDATE_SCENARIO,
                                {
                                    id: el.data.id,
                                    order: el.data.order - 1
                                }))
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
                const item = this.added.find(item => item.data.id === id);
                this.$store.dispatch(actions.CREATE_SCENARIO,
                    Object.assign({order: this.stored.length, active: false}, item.cache)).then(() => {
                    this.$store.commit(mutations.REMOVE_NEW_SCENARIO, id);
                });
            },
            onRemoveNewScenario(id) {
                this.$store.commit(mutations.REMOVE_NEW_SCENARIO, id);
            },
            onDragEnd(event) {
                let item = this.stored[event.oldIndex];
                this.$store.dispatch(actions.UPDATE_SCENARIO, {id: item.data.id, order: event.newIndex});

                let index = event.newIndex;
                const step = Math.sign(event.oldIndex - event.newIndex);
                while (index !== event.oldIndex) {
                    let item = this.stored[index];
                    index += step;
                    this.$store.dispatch(actions.UPDATE_SCENARIO, {id: item.data.id, order: index});
                }
            },
            onSwitchStoredScenarioActive(data, value) {
                this.$store.dispatch(actions.UPDATE_SCENARIO, {
                    id: data.id,
                    active: value
                });
            },
            onUpdateStoredScenarioCache(id, field, value) {
                const item = this.stored.find(item => item.data.id === id);
                let data = Object.assign({id: id}, item.cache);
                data[field] = value;
                this.$store.commit(mutations.UPDATE_STORED_SCENARIO_CACHE, data);
            },
            onUpdateNewScenarioCache(id, field, value) {
                const item = this.added.find(item => item.data.id === id);
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