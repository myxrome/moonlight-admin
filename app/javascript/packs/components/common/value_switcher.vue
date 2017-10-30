<template lang="pug">
    .switch.tiny
        input.switch-input(:id='item.id' type='checkbox' :checked='value' @change='$emit("switch", item, $event.target.checked)')
        label.switch-paddle(:for='item.id')
</template>

<script>
    export default {
        props: {
            item: Object,
            value: false,
        },
    }
</script>