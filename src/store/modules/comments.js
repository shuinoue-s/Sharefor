


const state = {
  comments: []
}
const getters = {
  comments: state => state.comments
}
const mutations = {
  setComments(state, commentList) {
    state.comments = commentList
  }
}
const actions = {
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
