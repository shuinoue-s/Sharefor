import { format } from 'date-fns'
import app from '../../firebase/firebase'
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore'

const db = getFirestore(app)

const state = {
  posts: []
}
const getters = {
  posts: state => state.posts
}
const mutations = {
  setPosts(state, posts) {
    state.posts = posts
  }
}
const actions = {
  async getPosts({ commit }) {
    const postsRef = collection(db, 'posts')
    const q = query(postsRef, orderBy('created_at', 'desc'))
    const querySnapshot = await getDocs(q)
    const postList = querySnapshot.docs.map(doc => doc.data())
    for(let i = 0; i < postList.length; i++) {
      postList[i].created_at = postList[i].created_at.toDate()
      postList[i].created_at = format(postList[i].created_at, 'yyyy/MM/dd HH:mm:ss')
    }
    commit('setPosts', postList)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}