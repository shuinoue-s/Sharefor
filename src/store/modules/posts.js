import { arrayDateFormat, arraySplitTags, arrayAddUserInfo } from '@/modules/storeModifications'
import app from '@/firebase/firebase'
import { getFirestore, getDocs, query, orderBy, collectionGroup, limit, startAfter } from 'firebase/firestore'

const db = getFirestore(app)

const state = {
  posts: null,
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
  },
  pushPosts(state, {postList, tags}) {
    state.posts.push(...postList)
    state.postTags.push(...tags)
  }
}
const actions = {
  async firstGetPosts({ commit }) {
    const postsCollectionGroup = collectionGroup(db, 'posts')
    const firstPosts = query(postsCollectionGroup, orderBy('created_at', 'desc'), limit(10))
    const querySnapshot = await getDocs(firstPosts)
    if(querySnapshot.size) {
      const lastVisiblePost = querySnapshot.docs[querySnapshot.docs.length-1]
      let postList = querySnapshot.docs.map(doc => doc.data())
      postList = arrayDateFormat(postList)
      const tags = arraySplitTags(postList)
      postList = await arrayAddUserInfo(postList)
      commit('setPosts', {postList, tags})
      return lastVisiblePost
    } else {
      return false
    }
  },
  async nextPosts({ commit }, preLastVisiblePost) {
      const postsCollectionGroup = collectionGroup(db, 'posts')
      const nextPosts = query(postsCollectionGroup, orderBy('created_at', 'desc'), startAfter(preLastVisiblePost), limit(10))
      const querySnapshot = await getDocs(nextPosts)
      if(querySnapshot.size) {
        const lastVisiblePost = querySnapshot.docs[querySnapshot.docs.length-1]
        let postList = querySnapshot.docs.map(doc => doc.data())
        postList = arrayDateFormat(postList)
        const tags = arraySplitTags(postList)
        postList = await arrayAddUserInfo(postList)
        commit('pushPosts', {postList, tags})
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