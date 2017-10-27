<template lang="pug">

    component(:is='current' :item='item' @save='(id) => $emit("save", id)' @destroy='(id) => $emit("destroy", id)' @cancel='(id) => $emit("switch", id)' @edit='(id) => $emit("switch", id)' @done='(id) => $emit("switch", id)')
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
    }

</script>