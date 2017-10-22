<template lang="pug">

tr
    slot
    td
        a(href='#' @click.prevent='save')
            i.fi-check
    td
        a(href='#' @click.prevent='$emit("cancel")')
            i.fi-x

</template>

<script>

export default {
    props: {
        item: Object,
    },
    methods: {
        save: function () {
            this.$store.dispatch('updateScenarioFromCache', this.item.data.id).then(() => {
                this.$emit('done');
            });
        }
    },
}

</script>