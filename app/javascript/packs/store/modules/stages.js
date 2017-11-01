import api from '../../api/server'
import * as mutations from '../mutation_types'
import * as actions from '../action_types'

export default {
    state: {
        // { data: {}, cache: {}, meta: {} }
        storedStages: [],
        newStages: [],
    },
    actions: {
        [actions.CREATE_STAGE]({commit}, data) {
            api.create('stages', data, created => {
                commit(mutations.ADD_OR_UPDATE_STORED_STAGE, created);
            }, error => {
            })
        },
        [actions.REQUEST_SCENARIO_STAGES]({commit}, scenarioId) {
            api.request(`scenarios/${scenarioId}/stages`, list => {
                list.forEach((value) => {
                    commit(mutations.ADD_OR_UPDATE_STORED_STAGE, value);
                });
            })
        },
        [actions.REQUEST_STAGE]({commit}, id) {
            api.request(`stages/${id}`, item => {
                commit(mutations.ADD_OR_UPDATE_STORED_STAGE, item);
            })
        },
        [actions.UPDATE_STAGE]({commit}, {id, ...data}) {
            api.update('stages', id, data, updated => {
                commit(mutations.ADD_OR_UPDATE_STORED_STAGE, updated);
            }, error => {
            });
        },
        [actions.DESTROY_STAGE]({commit}, id) {
            api.destroy('stages', id, () => {
                commit(mutations.REMOVE_STORED_STAGE, id);
            });
        },
    },
    mutations: {
        [mutations.ADD_OR_UPDATE_STORED_STAGE](state, value) {
            if (!state.storedStages.some((item) => {
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
                state.storedStages.push(created);
            }
        },
        [mutations.REMOVE_STORED_STAGE](state, id) {
            state.storedStages = state.storedStages.filter(function (item) {
                return item.data.id !== id;
            });
        },
        [mutations.SWITCH_STORED_STAGE_STATE](state, id) {
            const item = state.storedStages.find((item) => {
                return item.data.id === id;
            });
            item.cache = {};
            item.meta.state = item.meta.state === 'show' ? 'edit' : 'show';
        },
        [mutations.UPDATE_STORED_STAGE_CACHE](state, {id, ...data}) {
            const item = state.storedStages.find((item) => {
                return item.data.id === id;
            });
            item.cache = data;
        },
        [mutations.ADD_NEW_STAGE](state, data) {
            state.newStages.push({
                data: data,
                cache: {},
                meta: {state: 'edit'},
            });
        },
        [mutations.REMOVE_NEW_STAGE](state, id) {
            state.newStages = state.newStages.filter((item) => {
                return item.data.id !== id;
            })
        },
        [mutations.UPDATE_NEW_STAGE_CACHE](state, {id, ...data}) {
            const item = state.newStages.find((item) => {
                return item.data.id === id;
            });
            item.cache = data;
        },
    }
}
