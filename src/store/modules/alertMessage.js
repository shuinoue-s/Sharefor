const state = {
  signInMessage: '',
  signInErrorMessage: '',
  signOutMessage: '',
  signOutErrorMessage: '',
  postErrorMessage: '',
  askErrorMessage: '',
  postCommentErrorMessage: '',
  askCommentErrorMessage: ''
}
const getters = {
  signInMessage: state => {
    setTimeout(() => {
      state.signInMessage = ''
    }, 3000)
    return state.signInMessage
  },
  signInErrorMessage: state => {
    setTimeout(() => {
      state.signInErrorMessage = ''
    }, 3000)
    return state.signInErrorMessage
  },
  signOutMessage: state => {
    setTimeout(() => {
      state.signOutMessage = ''
    }, 3000)
    return state.signOutMessage
  },
  signOutErrorMessage: state => {
    setTimeout(() => {
      state.signOutErrorMessage = ''
    }, 3000)
    return state.signOutErrorMessage
  },
  postErrorMessage: state => {
    setTimeout(() => {
      state.postErrorMessage = ''
    }, 3000)
    return state.postErrorMessage
  },
  askErrorMessage: state => {
    setTimeout(() => {
      state.askErrorMessage = ''
    }, 3000)
    return state.askErrorMessage
  },
  postCommentErrorMessage: state => {
    setTimeout(() => {
      state.postCommentErrorMessage = ''
    }, 2000)
    return state.postCommentErrorMessage
  },
  askCommentErrorMessage: state => {
    setTimeout(() => {
      state.askCommentErrorMessage = ''
    }, 2000)
    return state.askCommentErrorMessage
  },
}
const mutations = {
  setSignInMessage(state, message) {
    state.signInMessage = message
  },
  setSignInErrorMessage(state, message) {
    state.signInErrorMessage = message
  },
  setSignOutMessage(state, message) {
    state.signOutMessage = message
  },
  setSignOutErrorMessage(state, message) {
    state.signOutErrorMessage = message
  },
  setPostErrorMessage(state, message) {
    state.postErrorMessage = message
  },
  setAskErrorMessage(state, message) {
    state.askErrorMessage = message
  },
  setPostCommentErrorMessage(state, message) {
    state.postCommentErrorMessage = message
  },
  setAskCommentErrorMessage(state, message) {
    state.askCommentErrorMessage = message
  }
}
const actions = {
  setSignInMessage({ commit }, message) {
    commit('setSignInMessage', message)
  },
  setSignInErrorMessage({ commit }, message) {
    commit('setSignInErrorMessage', message)
  },
  setSignOutMessage({ commit }, message) {
    commit('setSignOutMessage', message)
  },
  setSignOutErrorMessage({ commit }, message) {
    commit('setSignOutErrorMessage', message)
  },
  setPostErrorMessage({ commit }, message) {
    commit('setPostErrorMessage', message)
  },
  setAskErrorMessage({ commit }, message) {
    commit('setAskErrorMessage', message)
  },
  setPostCommentErrorMessage({ commit }, message) {
    commit('setPostCommentErrorMessage', message)
  },
  setAskCommentErrorMessage({ commit }, message) {
    commit('setAskCommentErrorMessage', message)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
