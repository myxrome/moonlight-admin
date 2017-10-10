import api from '../../api/scenarios'
import * as types from '../mutation_types'

export default {
  state: {
    scenarios: []
  },
  getters: {
    list: state => state.scenarios
  },
  actions: {
    upload({commit}) {
      api.upload(data => {
        commit(types.RECEIVE_SCENARIO_LIST, data);
      })
    },
    update({commit, state}, {id, ...data}) {
      let saved = state.scenarios.find((element) => {
        return element.id === id;
      });

      commit(types.UPDATE_SCENARIO, Object.assign({id: id}, data));
      api.update(id, data, updated => {
        commit(types.UPDATE_SCENARIO, updated);
      }, error => {
        commit(types.UPDATE_SCENARIO, saved);
      })
    },
    create({commit, state}, data) {
      data.order = state.scenarios.length + 1;
      api.create(data, created => {
        commit(types.ADD_SCENARIO, created);
      }, error => {

      })
    }
  },
  mutations: {
    [types.RECEIVE_SCENARIO_LIST](state, data) {
      state.scenarios = data;
    },
    [types.UPDATE_SCENARIO](state, data) {
      state.scenarios.forEach((element, index) => {
        if (element.id === data.id) {
          state.scenarios.splice(index, 1, Object.assign({}, state.scenarios[index], data));
        }
      })
    },
    [types.ADD_SCENARIO](state, data) {
      state.scenarios.push(data);
    },
  }
}