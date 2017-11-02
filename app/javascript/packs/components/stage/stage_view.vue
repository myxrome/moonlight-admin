<template lang="pug">
    #stages(v-if='stage && scenario')
        ul.breadcrumbs
            li
                router-link(to="/") Scenarios
            li
                router-link(:to='"/scenarios/" + scenario.data.id') {{ scenario.data.title }}
            li.current Stage \#{{ stage.data.order + 1 }}
        fieldset.fieldset
            legend Scenes
            scene-table(:stage-id='stage.data.id')
</template>

<script>
    import * as actions from '../../store/action_types'
    import SceneTable from '../scene/scene_table.vue'

    export default {
        computed: {
            stage: function () {
                return this.$store.state.stages.stored.find(item => item.data.id === Number.parseInt(this.$route.params.id))
            },
            scenario: function() {
                return this.$store.state.scenarios.stored.find(item => item.data.id === this.stage.data.scenario_id);
            }
        },
        components: {
            SceneTable,
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