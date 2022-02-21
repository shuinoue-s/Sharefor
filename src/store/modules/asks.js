import { arrayDateFormat, arraySplitTags, arrayAddUserInfo } from '@/modules/storeModifications'
import app from '@/firebase/firebase'
import { getFirestore, getDocs, query, orderBy, collectionGroup, startAfter, limit } from 'firebase/firestore'

const db = getFirestore(app)

const state = {
  asks: [],
  askTags: []
}
const getters = {
  asks: state => state.asks,
  askTags: state => state.askTags
}
const mutations = {
  setAsks(state, {askList, tags}) {
    state.asks = askList
    state.askTags = tags
  },
  pushAsks(state, {askList, tags}) {
    state.asks.push(...askList)
    state.askTags.push(...tags)
  }
}
const actions = {
  async firstGetAsks({ commit }) {
    const asksCollectionGroup = collectionGroup(db, 'asks')
    const q = query(asksCollectionGroup, orderBy('created_at', 'desc'), limit(10))
    const querySnapshot = await getDocs(q)
    if(querySnapshot.size) {
      const lastVisiblePost = querySnapshot.docs[querySnapshot.docs.length-1]
      let askList = querySnapshot.docs.map(doc => doc.data())
      askList = arrayDateFormat(askList)
      const tags = arraySplitTags(askList)
      askList = await arrayAddUserInfo(askList)
      commit('setAsks', {askList, tags})
      return lastVisiblePost
    } else {
      return false
    }
  },
  async nextAsks({ commit }, prelastVisiblePost) {
    const asksCollectionGroup = collectionGroup(db, 'asks')
    const nextAsks = query(asksCollectionGroup, orderBy('created_at', 'desc'), startAfter(prelastVisiblePost), limit(10))
    const querySnapshot = await getDocs(nextAsks)
    if(querySnapshot.size) {
      const lastVisiblePost = querySnapshot.docs[querySnapshot.docs.length-1]
      let askList = querySnapshot.docs.map(doc => doc.data())
      askList = arrayDateFormat(askList)
      const tags = arraySplitTags(askList)
      askList = await arrayAddUserInfo(askList)
      commit('pushAsks', {askList, tags})
      return lastVisiblePost
    } else {
      return false
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
