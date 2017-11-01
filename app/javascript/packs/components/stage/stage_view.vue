<template lang="pug">
    #stages
        ul.breadcrumbs
            li
                router-link(to="/") Scenarios
            li(v-if='scenario')
                router-link(:to='"/scenarios/" + scenario.data.id') {{ scenario.data.title }}
            li.current(v-if='stage') Stage \#{{ stage.data.order + 1 }}
</template>

<script>
    import * as actions from '../../store/action_types'

    export default {
        computed: {
            stage: function () {
                return this.$store.state.stages.stored.find(item => item.data.id === Number.parseInt(this.$route.params.id))
            },
            scenario: function() {
                return this.$store.state.scenarios.stored.find(item => item.data.id === this.stage.data.scenario_id);
            }
        },
        watch: {
            stage: function () {
                if (this.stage) {
                    this.$store.dispatch(actions.REQUEST_SCENARIO, this.stage.data.scenario_id);
                }
            }
        },
        created: function () {
            this.$store.dispatch(actions.REQUEST_STAGE, this.$route.params.id);
        },
    }
</script>