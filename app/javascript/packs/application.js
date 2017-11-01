/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb

import Vue from 'vue/dist/vue.esm'
import VueRouter from 'vue-router'

import store from './store/store'

import ScenarioTable from './components/scenario/scenario_table.vue'
import ScenarioView from './components/scenario/scenario_view.vue'
import StageView from './components/stage/stage_view.vue'

Vue.use(VueRouter);

const routes = [
    { path: '/', component: ScenarioTable },
    { path: '/scenarios/:id', component: ScenarioView },
    { path: '/stages/:id', component: StageView },
];

const router = new VueRouter({
    routes
});

window.app = new Vue({
    el: '#app',
    store,
    router,
});
