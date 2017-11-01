<template lang="pug">
    #scenarios(v-if='scenario')
        ul.breadcrumbs
            li
                router-link(to="/") Scenarios
            li.current(v-if='scenario') {{ scenario.data.title }}
        fieldset.fieldset
            legend Stages
            stage-table(:scenario-id='scenario.data.id')
</template>

<script>
    import * as actions from '../../store/action_types'
    import StageTable from '../stage/stage_table.vue'

    export default {
        computed: {
            scenario: function() {
                return this.$store.state.scenarios.stored.find(item => item.data.id === Number.parseInt(this.$route.params.id));
            }
        },
        components: {
            StageTable,
        },
        created: function () {
            this.$store.dispatch(actions.REQUEST_SCENARIO, this.$route.params.id);
        },
    }
</script>