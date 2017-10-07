import Vue from 'vue/dist/vue.esm'
import store from './store/store'
import ScenarioTable from './components/scenario_table.vue'


document.addEventListener('DOMContentLoaded', () => {

  window.scenarios = new Vue({
    el: '#app',
    store,
    components: {
      ScenarioTable
    }
  });

});

