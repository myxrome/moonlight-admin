import api from '../../api/server'
import * as mutations from '../mutation_types'
import * as actions from '../action_types'

export default {
    state: {
        // { data: {}, cache: {}, meta: {} }
        stored: [],
        added: [],
    },
    actions: {
        [actions.CREATE_SCENARIO]({commit}, data) {
            api.create('scenarios', data, created => {
                commit(mutations.ADD_OR_UPDATE_STORED_SCENARIO, created);
            }, error => {
            })
        },
        [actions.REQUEST_SCENARIOS]({commit}) {
            api.request('scenarios', list => {
                list.forEach((value) => {
                    commit(mutations.ADD_OR_UPDATE_STORED_SCENARIO, value);
                });
            })
        },
        [actions.REQUEST_SCENARIO]({commit}, id) {
            api.request(`scenarios/${id}`, item => {
                commit(mutations.ADD_OR_UPDATE_STORED_SCENARIO, item);
            })
        },
        [actions.UPDATE_SCENARIO]({commit}, {id, ...data}) {
            api.update('scenarios', id, data, updated => {
                commit(mutations.ADD_OR_UPDATE_STORED_SCENARIO, updated);
            }, error => {
            });
        },
        [actions.DESTROY_SCENARIO]({commit}, id) {
            api.destroy('scenarios', id, () => {
                commit(mutations.REMOVE_STORED_SCENARIO, id);
            });
        },
    },
    mutations: {
        [mutations.ADD_OR_UPDATE_STORED_SCENARIO](state, value) {
            if (!state.stored.some((item) => {
                    if (item.data.id === value.id) {
                        item.data = Object.assign(item.data, value);
                        return true;
                    }
                    return false;
                })) {
                const created = {
                    data: value,
                    cache: {},
                    meta: { state: 'show' },
                };
                state.stored.push(created);
            }
        },
        [mutations.REMOVE_STORED_SCENARIO](state, id) {
            state.stored = state.stored.filter(function (item) {
                return item.data.id !== id;
            });
        },
        [mutations.SWITCH_STORED_SCENARIO_STATE](state, id) {
            const item = state.stored.find((item) => {
                return item.data.id === id;
            });
            item.cache = {};
            item.meta.state = item.meta.state === 'show' ? 'edit' : 'show';
        },
        [mutations.UPDATE_STORED_SCENARIO_CACHE](state, {id, ...data}) {
            const item = state.stored.find((item) => {
                return item.data.id === id;
            });
            item.cache = data;
        },
        [mutations.ADD_NEW_SCENARIO](state, data) {
            state.added.push({
                data: data,
                cache: {},
                meta: {state: 'edit'},
            });
        },
        [mutations.REMOVE_NEW_SCENARIO](state, id) {
            state.added = state.added.filter((item) => {
                return item.data.id !== id;
            })
        },
        [mutations.UPDATE_NEW_SCENARIO_CACHE](state, {id, ...data}) {
            const item = state.added.find((item) => {
                return item.data.id === id;
            });
            item.cache = data;
        },
    }
}
