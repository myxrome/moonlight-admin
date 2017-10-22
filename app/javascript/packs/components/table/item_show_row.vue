<template lang="pug">

tr
    slot
    td
        a(href='#' @click.prevent='$emit("edit")')
            i.fi-pencil
    td
        a(href='#' @click.prevent='$emit("destroy")')
            i.fi-trash

</template>

<script>

export default {

}

</script>