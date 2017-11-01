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
                return this.$store.state.stages.storedStages.
                    filter(item => item.data.scenario_id === this.scenarioId).
                    sort((left, right) => left.data.order - right.data.order);
            },
            newStages: function () {
                return this.$store.state.stages.newStages.
                    filter(item => item.data.scenario_id === this.scenarioId);
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
                const item = this.storedStages.find(item => item.data.id === id);
                if (Object.keys(item.cache).length !== 0) {
                    this.$store.dispatch(actions.UPDATE_STAGE,
                        Object.assign({id: id}, item.cache)).then(() => {
                    });
                }
                this.$store.commit(mutations.SWITCH_STORED_STAGE_STATE, id);
            },
            onRemoveStoredStage(id) {
                const item = this.storedStages.find(item => item.data.id === id);
                if (confirm(`Delete "${item.data.order + 1}" stage?`)) {
                    this.$store.dispatch(actions.DESTROY_STAGE, id);
                    this.storedStages.
                        filter(el => el.data.order > item.data.order).
                        forEach(el =>
                            this.$store.dispatch(
                                actions.UPDATE_STAGE,
                                {
                                    id: el.data.id,
                                    order: el.data.order - 1
                                }))

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
                const item = this.newStages.find(item => item.data.id === id);
                this.$store.dispatch(actions.CREATE_STAGE,
                    Object.assign({order: this.storedStages.length, scenario_id: this.scenarioId}, item.cache)).then(() => {
                    this.$store.commit(mutations.REMOVE_NEW_STAGE, id);
                });
            },
            onRemoveNewStage(id) {
                this.$store.commit(mutations.REMOVE_NEW_STAGE, id);
            },
            onDragEnd(event) {
                let item = this.storedStages[event.oldIndex];
                this.$store.dispatch(actions.UPDATE_STAGE, {id: item.data.id, order: event.newIndex});

                let index = event.newIndex;
                const step = Math.sign(event.oldIndex - event.newIndex);
                while (index !== event.oldIndex) {
                    let item = this.storedStages[index];
                    index += step;
                    this.$store.dispatch(actions.UPDATE_STAGE, {id: item.data.id, order: index});
                }
            },
            onUpdateStoredStageCache(id, field, value) {
                const item = this.storedStages.find(item => item.data.id === id);
                let data = Object.assign({id: id}, item.cache);
                data[field] = value;
                this.$store.commit(mutations.UPDATE_STORED_STAGE_CACHE, data);
            },
            onUpdateNewStageCache(id, field, value) {
                const item = this.newStages.find(item => item.data.id === id);
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