const state = {
  isLoading: false
}
const getters = {
  isLoading: state => state.isLoading
}
const mutations = {
  setLoadingStatus(state, status) {
    state.isLoading = status
  }
}
const actions = {
  loading({ commit }) {
    commit('setLoadingStatus', true)
  },
  stopLoading({ commit }) {
    commit('setLoadingStatus', false)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
