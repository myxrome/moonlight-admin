import Vue from 'vue/dist/vue.esm'
import ScenarioTable from './components/scenario_table.vue'

document.addEventListener('DOMContentLoaded', () => {

    const scenarios = new Vue({
        el: '#app',
        components: {
            ScenarioTable
        }
    });

});

