import { arrayDateFormat } from '@/modules/methodsUsedInVuex'
import app from '@/firebase/firebase'
import { getFirestore, getDocs, query, orderBy, collection } from 'firebase/firestore'

const db = getFirestore(app)

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
  async getComments({ commit }, {uid, postId }) {
    if(postId && uid) {
      const commentsCollection = collection(db,'users', uid, 'posts', postId, 'comments')
      const q = query(commentsCollection, orderBy('created_at', 'desc'))
      const querySnapshot = await getDocs(q)
      let commentList = querySnapshot.docs.map(doc => doc.data())
      commentList = arrayDateFormat(commentList)
      commit('setComments', commentList)
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
