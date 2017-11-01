import Vue from 'vue/dist/vue.esm'
import Vuex from 'vuex'
import scenarios from './modules/scenarios'
import stages from './modules/stages'

Vue.use(Vuex);

export default new Vuex.Store({
    strict: true,
    modules: {
        scenarios,
        stages,
    }
});