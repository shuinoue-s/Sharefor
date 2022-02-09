import { getAuth, onAuthStateChanged } from "firebase/auth"
import app from '@/firebase/firebase'

const state = {
  user: '',
  isAuthenticated: false
}
const getters = {
  user: state => state.user,
  isAuthenticated: state => state.isAuthenticated
}
const mutations = {
  loginStatusChange(state, status) {
    state.isAuthenticated = status
  },
  setUser(state, user) {
    state.user = user
  }
}
const actions = {
  setResult({ commit }, user) {
      commit('loginStatusChange', true)
      commit('setUser', user)
  },
  onAuth({ commit }) {
    const auth = getAuth(app)
    onAuthStateChanged(auth, user => {
      if(user) {
        user = user ? user : {}
        commit('loginStatusChange', user.uid ? true : false)
        commit('setUser', user)
      }
    })
  },
  isSignOut({ commit }) {
    commit('loginStatusChange', false)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
