<template lang="pug">
    table-template.scenario-table(:stored='stored' :added='added'
                                    @switchRow='onSwitchSceneRow'
                                    @saveStoredItem='onSaveStoredScene'
                                    @removeStoredItem='onRemoveStoredScene'
                                    @addNewItem='onAddNewScene'
                                    @saveNewItem='onSaveNewScene'
                                    @removeNewItem='onRemoveNewScene')
        template(slot='thead')
            th.switch-column Example
            th Content
        template(slot='stored-show-row' slot-scope='{ item }')
            td
                value-switcher(:item='item.data' :value='item.data.example' @switch='onSwitchStoredSceneExample')
            td {{ item.data.content }}
        template(slot='stored-edit-row' slot-scope='{ item }')
            td
                value-switcher(:item='item.data' :value='item.data.example' @switch='onSwitchStoredSceneExample')
            td
                textarea(type='text' rows='1' :value='item.cache.content || item.data.content' @change='onUpdateStoredSceneCache(item.data.id, "content", $event.target.value)')
        template(slot='added-row' slot-scope='{ item }')
            td
            td
                textarea(type='text' rows='1' :value='item.cache.content || item.data.content' @change='onUpdateNewSceneCache(item.data.id, "content", $event.target.value)')

</template>

<script>
    import * as mutations from '../../store/mutation_types'
    import * as actions from '../../store/action_types'

    import TableTemplate from '../common/table/table_template.vue'
    import ValueSwitcher from '../common/value_switcher.vue'

    export default {
        props: {
            stageId: {
                type: Number,
                required: true,
            }
        },
        computed: {
            stored: function () {
                return this.$store.state.scenes.stored.
                    filter(item => item.data.stage_id === this.stageId);
            },
            added: function () {
                return this.$store.state.scenes.added.
                    filter(item => item.data.stage_id === this.stageId);
            },
        },
        components: {
            TableTemplate,
            ValueSwitcher,
        },
        methods: {
            onSwitchSceneRow(id) {
                this.$store.commit(mutations.SWITCH_STORED_SCENE_STATE, id);
            },
            onSaveStoredScene(id) {
                const item = this.stored.find(item => item.data.id === id);
                if (Object.keys(item.cache).length !== 0) {
                    this.$store.dispatch(actions.UPDATE_SCENE,
                        Object.assign({id: id}, item.cache)).then(() => {
                    });
                }
                this.$store.commit(mutations.SWITCH_STORED_SCENE_STATE, id);
            },
            onRemoveStoredScene(id) {
                const item = this.stored.find(item => item.data.id === id);
                if (confirm(`Delete "${item.data.content.substring(0, 5) }..." scene?`)) {
                    this.$store.dispatch(actions.DESTROY_SCENE, id);
                }
            },
            onAddNewScene() {
                this.$store.commit(mutations.ADD_NEW_SCENE, {
                    id: -Math.floor(Math.random() * 1000000 + 1),
                    stage_id: this.stageId,
                });
            },
            onSaveNewScene(id) {
                const item = this.added.find(item => item.data.id === id);
                this.$store.dispatch(actions.CREATE_SCENE,
                    Object.assign(item.data, item.cache)).then(() => {
                    this.$store.commit(mutations.REMOVE_NEW_SCENE, id);
                });
            },
            onRemoveNewScene(id) {
                this.$store.commit(mutations.REMOVE_NEW_SCENE, id);
            },
            onSwitchStoredSceneExample(data, value) {
                this.$store.dispatch(actions.UPDATE_SCENE, {
                    id: data.id,
                    example: value
                });
            },
            onUpdateStoredSceneCache(id, field, value) {
                const item = this.stored.find(item => item.data.id === id);
                let data = Object.assign({id: id}, item.cache);
                data[field] = value;
                this.$store.commit(mutations.UPDATE_STORED_SCENE_CACHE, data);
            },
            onUpdateNewSceneCache(id, field, value) {
                const item = this.added.find(item => item.data.id === id);
                let data = Object.assign({id: id}, item.cache);
                data[field] = value;
                this.$store.commit(mutations.UPDATE_NEW_SCENE_CACHE, data);
            },
        },
        created: function () {
            this.$store.dispatch(actions.REQUEST_STAGE_SCENES, this.stageId);
        },
    }

</script>