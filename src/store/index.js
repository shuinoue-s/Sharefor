import Vue from 'vue'
import Vuex from 'vuex'
import posts from './modules/posts'
import auth from './modules/auth'
import loading from './modules/loading'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    posts,
    auth,
    loading,
  },

  plugins: [createPersistedState({
    key: 'sharefor',
    paths: [
      'loading.isLoading'
    ],
    storage: window.sessionStorage
  })]
})
