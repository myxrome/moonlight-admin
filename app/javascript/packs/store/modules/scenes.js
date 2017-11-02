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
        [actions.CREATE_SCENE]({commit}, data) {
            api.create('scenes', data, created => {
                commit(mutations.ADD_OR_UPDATE_STORED_SCENE, created);
            }, error => {
            })
        },
        [actions.REQUEST_STAGE_SCENES]({commit}, stageId) {
            api.request(`stages/${stageId}/scenes`, list => {
                list.forEach((value) => {
                    commit(mutations.ADD_OR_UPDATE_STORED_SCENE, value);
                });
            })
        },
        [actions.UPDATE_SCENE]({commit}, {id, ...data}) {
            api.update('scenes', id, data, updated => {
                commit(mutations.ADD_OR_UPDATE_STORED_SCENE, updated);
            }, error => {
            });
        },
        [actions.DESTROY_SCENE]({commit}, id) {
            api.destroy('scenes', id, () => {
                commit(mutations.REMOVE_STORED_SCENE, id);
            });
        },
    },
    mutations: {
        [mutations.ADD_OR_UPDATE_STORED_SCENE](state, value) {
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
        [mutations.REMOVE_STORED_SCENE](state, id) {
            state.stored = state.stored.filter(function (item) {
                return item.data.id !== id;
            });
        },
        [mutations.SWITCH_STORED_SCENE_STATE](state, id) {
            const item = state.stored.find((item) => {
                return item.data.id === id;
            });
            item.cache = {};
            item.meta.state = item.meta.state === 'show' ? 'edit' : 'show';
        },
        [mutations.UPDATE_STORED_SCENE_CACHE](state, {id, ...data}) {
            const item = state.stored.find((item) => {
                return item.data.id === id;
            });
            item.cache = data;
        },
        [mutations.ADD_NEW_SCENE](state, data) {
            state.added.push({
                data: data,
                cache: {},
                meta: {state: 'edit'},
            });
        },
        [mutations.REMOVE_NEW_SCENE](state, id) {
            state.added = state.added.filter((item) => {
                return item.data.id !== id;
            })
        },
        [mutations.UPDATE_NEW_SCENE_CACHE](state, {id, ...data}) {
            const item = state.added.find((item) => {
                return item.data.id === id;
            });
            item.cache = data;
        },
    }
}
