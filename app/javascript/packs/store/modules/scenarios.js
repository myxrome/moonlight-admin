import api from '../../api/server'
import * as mutations from '../mutation_types'
import * as actions from '../action_types'
import * as helper from '../../common/store_helper'

export default {
    state: {
        // { data: {}, cache: {}, meta: {} }
        storedItems: [],
        newItems: [],
    },
    getters: {
        getStoredScenarios: state => state.storedItems,
        getStoredScenarioById: (state, getters) => (id) => {
            return state.storedItems.find((item) => {
                return item.data.id === id;
            });
        },
        getNewScenarios: state => state.newItems,
        getNewScenarioById: (state, getters) => (id) => {
            return state.newItems.find((item) => {
                return item.data.id === id;
            });
        },
    },
    actions: {
        [actions.CREATE_SCENARIO]({commit}, data) {
            api.create('scenarios', data, created => {
                commit(mutations.ADD_STORED_SCENARIO, created);
            }, error => {
            })
        },
        [actions.REQUEST_SCENARIOS]({commit}) {
            api.request('scenarios', list => {
                commit(mutations.APPLY_STORED_SCENARIOS, list);
            })
        },
        [actions.REQUEST_SCENARIO]({commit}, id) {
            api.request(`scenarios/${id}`, item => {
                commit(mutations.UPDATE_STORED_SCENARIO, item);
            })
        },
        [actions.UPDATE_SCENARIO]({commit}, {id, ...data}) {
            api.update('scenarios', id, data, updated => {
                commit(mutations.UPDATE_STORED_SCENARIO, updated);
            }, error => {
            });
        },
        [actions.DESTROY_SCENARIO]({dispatch, commit}, id) {
            api.destroy('scenarios', id, () => {
                commit(mutations.REMOVE_STORED_SCENARIO, id);
                dispatch(actions.REORDER_SCENARIOS);
            });
        },
        [actions.MOVE_SCENARIO]({dispatch, commit}, {from, to}) {
            commit(mutations.MOVE_STORED_SCENARIO, {from, to});
            dispatch(actions.REORDER_SCENARIOS);
        },
        [actions.REORDER_SCENARIOS]({dispatch, state}) {
            state.storedItems.forEach((item, index) => {
                if (item.data.order !== index) {
                    dispatch(actions.UPDATE_SCENARIO, {id: item.data.id, order: index});
                }
            });
        },
    },
    mutations: {
        [mutations.APPLY_STORED_SCENARIOS](state, list) {
            list.forEach((data) => {
                if (!helper.updateStoredOrderedItem(state.storedItems, data)) {
                    helper.addStoredOrderedItem(state.storedItems, data);
                }
            });
        },
        [mutations.ADD_STORED_SCENARIO](state, data) {
            helper.addStoredOrderedItem(state.storedItems, data);
        },
        [mutations.UPDATE_STORED_SCENARIO](state, data) {
            if (!helper.updateStoredOrderedItem(state.storedItems, data)) {
                helper.addStoredOrderedItem(state.storedItems, data);
            }
        },
        [mutations.MOVE_STORED_SCENARIO](state, {from, to}) {
            state.storedItems.move(from, to);
        },
        [mutations.REMOVE_STORED_SCENARIO](state, id) {
            state.storedItems = state.storedItems.filter(function (item) {
                return item.data.id !== id;
            });
        },
        [mutations.SWITCH_STORED_SCENARIO_STATE](state, id) {
            const item = state.storedItems.find((item) => {
                return item.data.id === id;
            });
            item.cache = {};
            item.meta.state = item.meta.state === 'show' ? 'edit' : 'show';
        },
        [mutations.UPDATE_STORED_SCENARIO_CACHE](state, {id, ...data}) {
            const item = state.storedItems.find((item) => {
                return item.data.id === id;
            });
            item.cache = data;
        },
        [mutations.ADD_NEW_SCENARIO](state, data) {
            state.newItems.push({
                data: data,
                cache: {},
                meta: {state: 'edit'},
            });
        },
        [mutations.REMOVE_NEW_SCENARIO](state, id) {
            state.newItems = state.newItems.filter((item) => {
                return item.data.id !== id;
            })
        },
        [mutations.UPDATE_NEW_SCENARIO_CACHE](state, {id, ...data}) {
            const item = state.newItems.find((item) => {
                return item.data.id === id;
            });
            item.cache = data;
        },
    }
}
