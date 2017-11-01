import api from '../../api/server'
import * as mutations from '../mutation_types'
import * as actions from '../action_types'
import * as helper from '../../common/store_helper'

export default {
    state: {
        // { data: {}, cache: {}, meta: {} }
        storedStages: [],
        newStages: [],
    },
    getters: {
        getStoredStagesByScenarioId: (state, getters) => (scenarioId) => {
            return state.storedStages.filter((item) => {
                return item.data.scenario_id === scenarioId;
            });
        },
        getStoredStageById: (state, getters) => (id) => {
            return state.storedStages.find((item) => {
                return item.data.id === id;
            });
        },
        getNewStagesByScenarioId: (state, getters) => (scenarioId) => {
            return state.newStages.filter((item) => {
                return item.data.scenario_id === scenarioId;
            });
        },
        getNewStageById: (state, getters) => (id) => {
            return state.newStages.find((item) => {
                return item.data.id === id;
            });
        },
    },

    actions: {
        [actions.CREATE_STAGE]({commit}, data) {
            api.create('stages', data, created => {
                commit(mutations.ADD_STORED_STAGE, created);
            }, error => {
            })
        },

        [actions.REQUEST_SCENARIO_STAGES]({commit}, scenarioId) {
            api.request(`scenarios/${scenarioId}/stages`, list => {
                commit(mutations.APPLY_STORED_STAGES, list);
            })
        },
        [actions.REQUEST_STAGE]({commit}, id) {
            api.request(`stages/${id}`, item => {
                commit(mutations.UPDATE_STORED_STAGE, item);
            })
        },
        [actions.UPDATE_STAGE]({commit}, {id, ...data}) {
            api.update('stages', id, data, updated => {
                commit(mutations.UPDATE_STORED_STAGE, updated);
            }, error => {
            });
        },
        [actions.DESTROY_STAGE]({dispatch, commit, getters}, id) {
            const scenarioId = getters.getStoredStageById(id).data.scenario_id;
            api.destroy('stages', id, () => {
                commit(mutations.REMOVE_STORED_STAGE, id);
                dispatch(actions.REORDER_STAGES, scenarioId);
            });
        },
        [actions.MOVE_STAGE]({dispatch, commit}, {scenarioId, from, to}) {
            console.log(`move from ${from} to ${to} for ${scenarioId}`);
            commit(mutations.MOVE_STORED_STAGE, {scenarioId, from, to});
            dispatch(actions.REORDER_STAGES, scenarioId);
        },
        [actions.REORDER_STAGES]({dispatch, state}, scenarioId) {
            state.storedStages.filter((item) => {
                return item.data.scenario_id === scenarioId;
            }).forEach((item, index) => {
                if (item.data.order !== index) {
                    console.log(`reorder ${item.data.id} from ${item.data.order} to ${index}`);
                    dispatch(actions.UPDATE_STAGE, {id: item.data.id, order: index});
                }
            });
        },
    },
    mutations: {
        [mutations.APPLY_STORED_STAGES](state, list) {
            list.forEach((data) => {
                if (!helper.updateStoredOrderedItem(state.storedStages, data)) {
                    helper.addStoredOrderedItem(state.storedStages, data);
                }
            });
        },
        [mutations.ADD_STORED_STAGE](state, data) {
            helper.addStoredOrderedItem(state.storedStages, data);
        },
        [mutations.UPDATE_STORED_STAGE](state, data) {
            if (!helper.updateStoredOrderedItem(state.storedStages, data)) {
                helper.addStoredOrderedItem(state.storedStages, data);
            }
        },
        [mutations.MOVE_STORED_STAGE](state, {scenarioId, from, to}) {
            state.storedStages.filter((item) => {
                return item.data.scenario_id === scenarioId;
            }).move(from, to);
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
