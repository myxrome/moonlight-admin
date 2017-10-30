<template lang="pug">
    #scenarios
        ul.breadcrumbs
            li
                router-link(to="/") Scenarios
            li.current(v-if='scenario') {{ scenario.data.title }}
        h3(v-if='scenario') {{ scenario.data.title }}
</template>

<script>
    import * as actions from '../../store/action_types'

    export default {
        computed: {
            scenario: function() {
                return this.$store.getters.getStoredScenarioById(Number.parseInt(this.$route.params.id));
            }
        },
        created: function () {
            this.$store.dispatch(actions.REQUEST_SCENARIO, this.$route.params.id);
        },
    }
</script>