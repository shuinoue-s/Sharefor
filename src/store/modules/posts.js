import { format } from 'date-fns'
import app from '../../firebase/firebase'
import { getFirestore, getDocs, query, orderBy, collectionGroup } from 'firebase/firestore'

const db = getFirestore(app)

const state = {
  posts: [],
  tags: [],
  eachUserPosts: []
}
const getters = {
  posts: state => state.posts,
  tags: state =>  state.tags,
}
const mutations = {
  setPosts(state, {postList, tags}) {
    state.posts = postList
    state.tags = tags
  }
}
const actions = {
  async getPosts({ commit }) {
    const postsCollectionGroup = collectionGroup(db, 'posts')
    // const usersCollectionRef = collection(db, 'users', 'posts')
    const q = query(postsCollectionGroup, orderBy('created_at', 'desc'))
    const querySnapshot = await getDocs(q)
    let postList = querySnapshot.docs.map(doc => doc.data())
    let tags = []
    for(let i = 0; i < postList.length; i++) {
      postList[i].created_at = postList[i].created_at.toDate()
      postList[i].created_at = format(postList[i].created_at, 'yyyy/MM/dd HH:mm:ss')
      tags.push(...postList[i].tags)
    }
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