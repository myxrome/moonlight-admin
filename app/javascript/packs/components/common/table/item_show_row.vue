<template lang="pug">

    tr
        slot
        td
            a(href='#' @click.prevent='$emit("edit", item.data.id)')
                i.fi-pencil
        td
            a(href='#' @click.prevent='$emit("remove", item.data.id)')
                i.fi-trash

</template>

<script>

    export default {
        props: {
            item: Object,
        },
    }

</script>