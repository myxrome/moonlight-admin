<template lang="pug">
    table-template.scenario-table(:storedItems='storedStages' :newItems='newStages' :draggable='true'
                                    @switchRow='onSwitchStageRow'
                                    @saveStoredItem='onSaveStoredStage'
                                    @removeStoredItem='onRemoveStoredStage'
                                    @addNewItem='onAddNewStage'
                                    @saveNewItem='onSaveNewStage'
                                    @removeNewItem='onRemoveNewStage'
                                    @dragEnd='onDragEnd')
        template(slot='thead')
            th.button-column
            th(style='width: 20%')
            th(style='width: 20%') Duration
            th
        template(slot='show-row' slot-scope='{ item }')
            td
                router-link(:to='"/stages/" + item.data.id')
                    i.fi-list-thumbnails
            td
            td {{ item.data.duration }}
            td
        template(slot='edit-row' slot-scope='{ item }')
            td
                router-link(:to='"/stages/" + item.data.id')
                    i.fi-list-thumbnails
            td
            td
                input(type='number' :value='item.data.duration' @change='onUpdateStoredStageCache(item.data.id, "duration", $event.target.value)')
            td
        template(slot='new-row' slot-scope='{ item }')
            td
            td
            td
                input(type='number' :value='item.cache.duration' @change='onUpdateNewStageCache(item.data.id, "duration", $event.target.value)')
            td

</template>

<script>
    import * as mutations from '../../store/mutation_types'
    import * as actions from '../../store/action_types'

    import TableTemplate from '../common/table/table_template.vue'

    export default {
        props: {
            scenarioId: {
                type: Number,
                required: true,
            }
        },
        computed: {
            storedStages: function () {
                return this.$store.getters.getStoredStagesByScenarioId(this.scenarioId);
            },
            newStages: function () {
                return this.$store.getters.getNewStagesByScenarioId(this.scenarioId);
            },
        },
        components: {
            TableTemplate,
        },
        methods: {
            onSwitchStageRow(id) {
                this.$store.commit(mutations.SWITCH_STORED_STAGE_STATE, id);
            },
            onSaveStoredStage(id) {
                const item = this.$store.getters.getStoredStageById(id);
                if (Object.keys(item.cache).length === 0) {
                    this.$store.commit(mutations.SWITCH_STORED_STAGE_STATE, id);
                    return;
                }
                this.$store.dispatch(actions.UPDATE_STAGE,
                    Object.assign({id: id}, item.cache)).then(() => {
                    this.$store.commit(mutations.SWITCH_STORED_STAGE_STATE, id);
                });
            },
            onRemoveStoredStage(id) {
                const item = this.$store.getters.getStoredStageById(id);
                if (confirm(`Delete "${item.data.order + 1}" stage?`)) {
                    this.$store.dispatch(actions.DESTROY_STAGE, id);
                }
            },
            onAddNewStage() {
                this.$store.commit(mutations.ADD_NEW_STAGE, {
                    id: -Math.floor(Math.random() * 1000000 + 1),
                    scenario_id: this.scenarioId,
                    duration: 0,
                });
            },
            onSaveNewStage(id) {
                const item = this.$store.getters.getNewStageById(id);
                this.$store.dispatch(actions.CREATE_STAGE,
                    Object.assign({order: this.storedStages.length, scenario_id: this.scenarioId}, item.cache)).then(() => {
                    this.$store.commit(mutations.REMOVE_NEW_STAGE, id);
                });
            },
            onRemoveNewStage(id) {
                this.$store.commit(mutations.REMOVE_NEW_STAGE, id);
            },
            onDragEnd(event) {
                this.$store.dispatch(actions.MOVE_STAGE, {
                    scenarioId: this.scenarioId,
                    from: event.oldIndex,
                    to: event.newIndex
                });
            },
            onUpdateStoredStageCache(id, field, value) {
                const item = this.$store.getters.getStoredStageById(id);
                let data = Object.assign({id: id}, item.cache);
                data[field] = value;
                this.$store.commit(mutations.UPDATE_STORED_STAGE_CACHE, data);
            },
            onUpdateNewStageCache(id, field, value) {
                const item = this.$store.getters.getNewStageById(id);
                let data = Object.assign({id: id}, item.cache);
                data[field] = value;
                this.$store.commit(mutations.UPDATE_NEW_STAGE_CACHE, data);
            },
        },
        created: function () {
            this.$store.dispatch(actions.REQUEST_SCENARIO_STAGES, this.scenarioId);
        },
    }

</script>