import { arrayDateFormat, arraySplitTags, arrayAddUserInfo } from '@/modules/storeModifications'
import app from '@/firebase/firebase'
import { getFirestore, getDocs, query, orderBy, collectionGroup } from 'firebase/firestore'

const db = getFirestore(app)

const state = {
  asks: [],
  askTags: [],
}
const getters = {
  asks: state => state.asks,
  askTags: state =>  state.askTags,
}
const mutations = {
  setAsks(state, {askList, tags}) {
    state.asks = askList
    state.askTags = tags
  }
}
const actions = {
  async getAsks({ commit }) {
    const asksCollectionGroup = collectionGroup(db, 'asks')
    const q = query(asksCollectionGroup, orderBy('created_at', 'desc'))
    const querySnapshot = await getDocs(q)
    let askList = querySnapshot.docs.map(doc => doc.data())
    askList = arrayDateFormat(askList)
    const tags = arraySplitTags(askList)
    askList = await arrayAddUserInfo(askList)
    console.log(askList)
    commit('setAsks', {askList, tags})
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
