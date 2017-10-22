import api from '../../api/server'
import * as types from '../mutation_types'

export default {
    state: {
        all: [], // { data: {}, cache: {}, meta: {} }
    },
    getters: {
        getAllScenarios: state => state.all,
        getScenarioById: (state, getters) => (id) => {
            return state.all.find((item) => {
                return item.data.id === id;
            });
        },
    },
    actions: {
        fetch({commit}) {
            api.fetch('scenarios', list => {
                commit(types.APPLY_LIST, list);
            })
        },
        create({commit, state}, data) {
            data.order = state.all.length;
            data.active = false;
            api.create('scenarios', data, created => {
                commit(types.ADD_ITEM, created);
            }, error => {
            })
        },
        update({commit}, {id, ...data}) {
            api.update('scenarios', id, data, updated => {
                commit(types.UPDATE_ITEM, updated);
            }, error => {
            });
        },
        updateScenarioFromCache({dispatch, state}, id) {
            const item = state.all.find((item) => {
                return item.data.id === id;
            });
            if (Object.keys(item.cache).length > 0) {
                dispatch('update', Object.assign({id: id}, item.cache));
            }
        },
        move({dispatch, commit}, {from, to}) {
            commit(types.MOVE_ITEM, {from, to});
            dispatch('reorder');
        },
        reorder({dispatch, state}) {
            state.all.forEach((item, index) => {
                if (item.data.order !== index) {
                    dispatch('update', {id: item.data.id, order: index});
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
            list.forEach((data) => {
                if (!update(state, data)) {
                    add(state, data);
                }
            });
        },
        [types.ADD_ITEM](state, data) {
            add(state, data);
        },
        [types.UPDATE_ITEM](state, data) {
            if (!update(state, data)) {
                add(state, data);
            }
        },
        [types.MOVE_ITEM](state, {from, to}) {
            state.all.move(from, to);
        },
        [types.REMOVE_ITEM](state, id) {
            state.all = state.all.filter(function (item) {
                return item.data.id !== id;
            });
        },
        [types.SWITCH_SCENARIO_LINE_STATE](state, id) {
            const item = state.all.find((item) => {
                return item.data.id === id;
            });
            item.cache = {};
            item.meta.state = item.meta.state === 'show' ? 'edit' : 'show';
        },
        [types.UPDATE_SCENARIO_CACHE](state, {id, field, value}) {
            const item = state.all.find((item) => {
                return item.data.id === id;
            });
            item.cache[field] = value;
        }
    }
}

function add(state, scenario) {
    let index = state.all.findIndex((item) => {
        return scenario.order < item.data.order;
    });
    index = index < 0 ? state.all.length : index;
    let created = {
        data: scenario,
        cache: {},
        meta: { state: 'show' },
    };
    state.all.insert(index, created);
}

function update(state, scenario) {
    return state.all.some((item, index) => {
        if (item.data.id === scenario.id) {
            const updated = {
                data: Object.assign({}, item.data, scenario),
                cache: Object.assign({}, item.cache),
                meta: Object.assign({}, item.meta),
            };
            state.all.replace(index, updated);
            if (index !== updated.data.order) {
                state.all.move(index, item.data.order);
            }
            return true;
        }
        return false;
    });
}
