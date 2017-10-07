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
    }
  },
  mutations: {
    [types.RECEIVE_SCENARIO_LIST](state, data) {
      state.scenarios = data;
    }
  }
}