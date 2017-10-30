import Vue from 'vue/dist/vue.esm'
import Vuex from 'vuex'
import scenarios from './modules/scenarios'

Vue.use(Vuex);

export default new Vuex.Store({
    strict: true,
    modules: {
        scenarios
    }
});