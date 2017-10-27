<template lang="pug">

    tr
        slot
        td
            a(href='#' @click.prevent='$emit("save", item.data.id)')
                i.fi-check
        td
            a(href='#' @click.prevent='$emit("cancel", item.data.id)')
                i.fi-x

</template>

<script>

    export default {
        props: {
            item: Object,
        },
    }

</script>