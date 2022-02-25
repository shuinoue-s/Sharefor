<template>
  <div>    
    <DisplayPostList
      v-if="posts"
      :setPosts="posts"
    >
      <v-divider></v-divider>
      <div class="d-flex justify-center text-center">
        <v-icon color="customGreen">{{ mdiTagMultipleOutline }}</v-icon>
        <p class="tag-style mb-0">{{ $route.params.tag }}</p>
      </div>
      <v-divider class="mb-4"></v-divider>
    </DisplayPostList>

    <InfiniteLoading v-if="posted" ref="infiniteLoading" spinner="spiral" @infinite="infiniteLoad">
      <span slot="no-more"></span>
      <span slot="no-results"></span>
    </InfiniteLoading>
  </div>
</template>

<script>
import { mdiTagMultipleOutline } from '@mdi/js'
import DisplayPostList from '../components/DisplayPostList'
import { arrayDateFormat, arrayAddUserInfo } from '@/modules/storeModifications'
import { getFirestore, query, getDocs, collectionGroup, where, orderBy, limit, startAfter } from 'firebase/firestore'
import InfiniteLoading from 'vue-infinite-loading'
import { ref } from 'vue'
import { mapActions } from 'vuex'

export default {
  name: 'TaggedPostList',
  components: {
    InfiniteLoading,
    DisplayPostList
  },
  setup() {
    const posted = ref(false)
    return { posted }
  },
  data() {
    return {
      mdiTagMultipleOutline,
      posted: '',
      posts: null
    }
  },
  async created() {
    this.onAuth()
    this.lastVisiblePost = await this.firstGetTaaggedPosts()
    this.posted = true
  },
  methods: {
    ...mapActions('auth', ['onAuth']),
    async infiniteLoad() {
      this.lastVisiblePost = await this.nextTaggedPosts(this.lastVisiblePost)
      this.$refs.infiniteLoading.stateChanger.loaded()
      if(!this.lastVisiblePost) {
        this.$refs.infiniteLoading.stateChanger.complete()
      }
    },
    async firstGetTaaggedPosts() {
      const db = getFirestore()
      const postsCollectionGroup = collectionGroup(db, 'posts')
      const q = query(postsCollectionGroup, where("tags", "array-contains", this.$route.params.tag), orderBy('created_at', 'desc'), limit(10))
      const querySnapshot = await getDocs(q)
      if(querySnapshot.size) {
        const lastVisiblePost = querySnapshot.docs[querySnapshot.docs.length-1]
        let posts = querySnapshot.docs.map(doc => doc.data())
        posts = arrayDateFormat(posts)
        posts = await arrayAddUserInfo(posts)
        this.posts = posts
        return lastVisiblePost
      } else {
        return false
      }
    },
    async nextTaggedPosts(prelastVisiblePost) {
      const db = getFirestore()
      const postsCollectionGroup = collectionGroup(db, 'posts')
      const nextPosts = query(postsCollectionGroup, where("tags", "array-contains", this.$route.params.tag), orderBy('created_at', 'desc'), startAfter(prelastVisiblePost),  limit(10))
      const querySnapshot = await getDocs(nextPosts)
      if(querySnapshot.size) {
        const lastVisiblePost = querySnapshot.docs[querySnapshot.docs.length-1]
        let posts = querySnapshot.docs.map(doc => doc.data())
        posts = arrayDateFormat(posts)
        posts = await arrayAddUserInfo(posts)
        this.posts.push(...posts)
        return lastVisiblePost
      } else {
        return false
      }
    }
  }
}
</script>

<style scoped>
  .tag-style {
    color: #21BF73;
    font-size: 20px;
    font-weight: bold;
  }
</style>