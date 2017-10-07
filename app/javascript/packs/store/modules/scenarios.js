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
    update({commit, state}, data) {
      let saved = state.scenarios.find((element) => {
        return element.id === data.id;
      });

      commit(types.RECEIVE_SCENARIO, data);
      api.update(data, updated => {
        commit(types.RECEIVE_SCENARIO, updated);
      }, error => {
        commit(types.RECEIVE_SCENARIO, saved);
      })
    }
  },
  mutations: {
    [types.RECEIVE_SCENARIO_LIST](state, data) {
      state.scenarios = data;
    },
    [types.RECEIVE_SCENARIO](state, data) {
      state.scenarios.forEach((element, index) => {
        if (element.id === data.id) {
          state.scenarios.splice(index, 1, Object.assign({}, state.scenarios[index], data));
        }
      })
    }
  }
}