import { dateFormat, splitArray } from '@/modules/methodsUsedInVuex'
import app from '../../firebase/firebase'
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
    // const usersCollectionRef = collection(db, 'users', 'asks')
    const q = query(asksCollectionGroup, orderBy('created_at', 'desc'))
    const querySnapshot = await getDocs(q)
    let askList = querySnapshot.docs.map(doc => doc.data())
    askList = dateFormat(askList)
    const tags = splitArray(askList)
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
