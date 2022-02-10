import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import posts from './modules/posts'
import asks from './modules/asks'
import comments from './modules/comments'
import loading from './modules/loading'
import alertMessage from './modules/alertMessage'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    auth,
    posts,
    asks,
    comments,
    loading,
    alertMessage
  },

  plugins: [createPersistedState({
    key: 'sharefor',
    paths: [
      'loading.isLoading',
      'auth.isAuthenticated'
    ],
    // storage: window.sessionStorage
  })]
})
