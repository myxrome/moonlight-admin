<template lang="pug">

component(:is='current' :item='item' @save='onSave' @destroy='onDestroy' @cancel='switchItemState' @edit='switchItemState' @done='switchItemState')
    slot(name='show-row' v-if='current === "item-show-row"')
    slot(name='edit-row' v-if='current === "item-edit-row"')

</template>

<script>
import ItemShowRow from './item_show_row.vue'
import ItemEditRow from './item_edit_row.vue'

export default {
    props: {
        item: Object,
    },
    computed: {
        current: function () {
            return this.item.meta.state === 'show' ? 'item-show-row' : 'item-edit-row';
        }
    },
    components: {
        ItemShowRow,
        ItemEditRow,
    },
    methods: {
        switchItemState: function () {
            this.$store.commit('SWITCH_SCENARIO_LINE_STATE', this.item.data.id);
        },
        onSave(id) {
            this.$store.dispatch('updateScenarioFromCache', id).then(() => {
                this.$store.commit('SWITCH_SCENARIO_LINE_STATE', id);
            });
        },
        onDestroy(id) {
            if (confirm('Delete this scenario?')) {
                this.$store.dispatch('destroy', id);
            }
        }
    },
}

</script>