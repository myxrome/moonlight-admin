<template lang="pug">
    #scenarios
        ul.breadcrumbs
            li
                router-link(to="/") Scenarios
            li.current {{ scenario.title }}
        h3(v-if='scenario') {{ scenario.title }}
</template>

<script>
    export default {
        computed: {
            scenario: function () {
                return this.$store.getters.getScenarioById(this.$route.params.id);
            }
        }
    }
</script>