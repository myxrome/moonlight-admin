<template lang="pug">

#table
    table
        thead
            tr(is='table-header-row')
                slot(name='thead')
        draggable(v-if='options.draggable' element="tbody" :options="{filter: 'a, input, textarea, .switch', preventOnFilter: false, draggable: '.draggable-item', dragClass: 'draggable-ghost', chosenClass: 'draggable-chosen'}" @end='onDragEnd')
            tr.draggable-item(is='switch-row' v-for='item in items' :key='item.data.id' :item='item')
                template(slot='show-row')
                    slot(name='show-row-table' :item='item')
                template(slot='edit-row')
                    slot(name='edit-row-table' :item='item')
            tr(is='item-edit-row' v-for='item in newItems' :key='item.data.id' :item='item' @cancel='onNewCancel' @save='onSave')
                template
                    slot(name='new-row-table' :item='item')
        tbody(v-else)
            tr(is='switch-row' v-for='item in i' :key='item.data.id' :item='item')
                template(slot='show-row')
                    slot(name='show-row-table' :item='item')
                template(slot='edit-row')
                    slot(name='edit-row-table' :item='item')
    a.float-right(href='#' @click.prevent='addNew')
        i.fi-plus

</template>

<script>
import Draggable from 'vuedraggable'
import TableHeaderRow from './header_row.vue'
import SwitchRow from './switch_row.vue'
import ItemEditRow from './item_edit_row.vue'

export default {
    props: {
        items: Array,
        newItems: Array,
        options: Object,
    },
    components: {
        Draggable,
        TableHeaderRow,
        SwitchRow,
        ItemEditRow,
    },
    methods: {
        onDragEnd(event) {
            this.$emit('onDragEnd', event);
        },
        addNew() {
            this.$store.commit('ADD_NEW_SCENARIO_ITEM');
        },
        onNewCancel(id) {
            this.$store.commit('DELETE_NEW_SCENARIO_ITEM', id);
        },
        onSave(id) {
            this.$store.dispatch('createScenarioFromCache', id).then(() => {
                this.$store.commit('DELETE_NEW_SCENARIO_ITEM', id);
            });
        },
    },
}

</script>