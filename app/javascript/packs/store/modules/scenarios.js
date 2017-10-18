import api from '../../api/scenarios'
import * as types from '../mutation_types'

export default {
    state: {
        scenarios: [],
    },
    getters: {
        list: state => state.scenarios,
        getScenarioById: (state, getters) => (id) => {
            return state.scenarios.find((item) => {
                return item.id == id;
            });
        },
    },
    actions: {
        upload({commit}) {
            api.upload(data => {
                commit(types.RECEIVE_SCENARIO_LIST, data);
            })
        },
        update({commit}, {id, ...data}) {
            return api.update(id, data, updated => {
                commit(types.UPDATE_SCENARIO, updated);
            }, error => {
            });
        },
        create({commit, state}, data) {
            data.order = state.scenarios.length;
            api.create(data, created => {
                commit(types.ADD_SCENARIO, created);
            }, error => {
            })
        },
        erase({dispatch, commit, state}, scenario) {
            api.erase(scenario.id, () => {
                commit(types.ERASE_SCENARIO, scenario.id)
                dispatch('reorder');
            });
        },
        move({dispatch, commit, state}, oldIndex, newIndex) {
            commit(types.MOVE_SCENARIO, oldIndex, newIndex);
            dispatch('reorder');
        },
        reorder({dispatch, state}) {
            state.scenarios.forEach((item, index) => {
                if (item.order !== index) {
                    dispatch('update', {id: item.id, order: index});
                }
            });
        },
    },
    mutations: {
        [types.MOVE_SCENARIO](state, {oldIndex, newIndex}) {
            state.scenarios.splice(newIndex, 0, state.scenarios.splice(oldIndex, 1)[0]);
        },
        [types.RECEIVE_SCENARIO_LIST](state, data) {
            data.forEach((element) => {
                updateOrAdd(state, element);
            });
        },
        [types.UPDATE_SCENARIO](state, data) {
            updateOrAdd(state, data);
        },
        [types.ADD_SCENARIO](state, data) {
            add(state, data);
        },
        [types.ERASE_SCENARIO](state, id) {
            state.scenarios = state.scenarios.filter(function (item) {
                return item.id !== id;
            });
        },
    }
}

function add(state, data) {
    let index = state.scenarios.findIndex(function (element) {
        return data.order < element.order;
    });
    index = index < 0 ? state.scenarios.length : index;
    // insert
    state.scenarios.splice(index, 0, data);
}

function updateOrAdd(state, data) {
    const found = state.scenarios.some((element, index) => {
        if (element.id === data.id) {
            const newItem = Object.assign({}, state.scenarios[index], data);
            if (index === newItem.order) {
                // replace
                state.scenarios.splice(index, 1, newItem);
            } else {
                // move
                state.scenarios.splice(newItem.order, 0, state.scenarios.splice(index, 1)[0]);
            }
            return true;
        }
        return false;
    });
    if (!found) {
        // not found, add
        add(state, data);
    }
}