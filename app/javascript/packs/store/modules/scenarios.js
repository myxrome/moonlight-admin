import api from '../../api/server'
import * as types from '../mutation_types'

export default {
    state: {
        all: [],
    },
    getters: {
        getAllScenarios: state => state.all,
        getScenarioById: (state, getters) => (id) => {
            return state.all.find((item) => {
                // noinspection EqualityComparisonWithCoercionJS
                return item.id == id;
            });
        },
    },
    actions: {
        fetch({commit}) {
            api.fetch('scenarios', list => {
                commit(types.APPLY_LIST, list);
            })
        },
        create({commit, state}, scenario) {
            scenario.order = state.all.length;
            scenario.active = false;
            api.create('scenarios', scenario, created => {
                commit(types.ADD_ITEM, created);
            }, error => {
            })
        },
        update({commit}, {id, ...scenario}) {
            return api.update('scenarios', id, scenario, updated => {
                commit(types.UPDATE_ITEM, updated);
            }, error => {
            });
        },
        move({dispatch, commit}, {from, to}) {
            commit(types.MOVE_ITEM, {from, to});
            dispatch('reorder');
        },
        reorder({dispatch, state}) {
            state.all.forEach((scenario, index) => {
                if (scenario.order !== index) {
                    dispatch('update', {id: scenario.id, order: index});
                }
            });
        },
        destroy({dispatch, commit}, id) {
            api.destroy('scenarios', id, () => {
                commit(types.REMOVE_ITEM, id);
                dispatch('reorder');
            });
        },
    },
    mutations: {
        [types.APPLY_LIST](state, list) {
            list.forEach((scenario) => {
                if (!update(state, scenario)) {
                    add(state, scenario);
                }
            });
        },
        [types.ADD_ITEM](state, scenario) {
            add(state, scenario);
        },
        [types.UPDATE_ITEM](state, scenario) {
            if (!update(state, scenario)) {
                add(state, scenario);
            }
        },
        [types.MOVE_ITEM](state, {from, to}) {
            state.all.move(from, to);
        },
        [types.REMOVE_ITEM](state, id) {
            state.all = state.all.filter(function (scenario) {
                return scenario.id !== id;
            });
        },
    }
}

function add(state, scenario) {
    let index = state.all.findIndex((item) => {
        return scenario.order < item.order;
    });
    index = index < 0 ? state.all.length : index;
    state.all.insert(index, scenario);
}

function update(state, scenario) {
    return state.all.some((item, index) => {
        if (item.id === scenario.id) {
            const updated = Object.assign({}, state.all[index], scenario);
            if (index === updated.order) {
                state.all.replace(index, updated);
            } else {
                state.all.move(index, updated.order);
            }
            return true;
        }
        return false;
    });
}
