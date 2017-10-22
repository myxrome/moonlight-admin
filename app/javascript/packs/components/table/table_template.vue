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
        tbody(v-else)
            tr(is='switch-row' v-for='item in i' :key='item.data.id' :item='item')
                template(slot='show-row')
                    slot(name='show-row-table' :item='item')
                template(slot='edit-row')
                    slot(name='edit-row-table' :item='item')

</template>

<script>
import Draggable from 'vuedraggable'
import TableHeaderRow from './header_row.vue'
import SwitchRow from './switch_row.vue'

export default {
    props: {
        items: Array,
        options: Object,
    },
    components: {
        Draggable,
        TableHeaderRow,
        SwitchRow,
    },
    methods: {
        onDragEnd(event) {
            this.$emit('onDragEnd', event);
        },
    },
}

</script>