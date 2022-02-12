import { arrayDateFormat, arraySplitTags, addUserInfo } from '@/modules/storeModifications'
import app from '@/firebase/firebase'
import { getFirestore, getDocs, query, orderBy, collectionGroup } from 'firebase/firestore'

const db = getFirestore(app)

const state = {
  posts: [],
  postTags: []
}
const getters = {
  posts: state => state.posts,
  postTags: state =>  state.postTags,
}
const mutations = {
  setPosts(state, {postList, tags}) {
    state.posts = postList
    state.postTags = tags
  }
}
const actions = {
  async getPosts({ commit }) {
    const postsCollectionGroup = collectionGroup(db, 'posts')
    const q = query(postsCollectionGroup, orderBy('created_at', 'desc'))
    const querySnapshot = await getDocs(q)
    let postList = querySnapshot.docs.map(doc => doc.data())
    postList = arrayDateFormat(postList)
    const tags = arraySplitTags(postList)
    postList = await addUserInfo(postList)
    commit('setPosts', {postList, tags})
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}