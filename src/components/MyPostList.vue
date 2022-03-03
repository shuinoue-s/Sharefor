<template>
  <div>
    <DisplayPostList
      v-if="posts"
      :setPosts="posts"
      @delete-after="firstGetPosts"
    />

    <InfiniteLoading v-if="posted" ref="infiniteLoading" spinner="spiral" @infinite="infiniteLoad">
      <span slot="no-more"></span>
      <span slot="no-results"></span>
    </InfiniteLoading>
  </div>
</template>

<script>
import DisplayPostList from '../components/DisplayPostList'
import { arrayDateFormat, arrayAddUserInfo } from '@/modules/storeModifications'
import { getFirestore, query, getDocs, collection, orderBy, limit, startAfter } from 'firebase/firestore'
import InfiniteLoading from 'vue-infinite-loading'
import { ref } from 'vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'MyPostList',
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
      posted: '',
      posts: null
    }
  },
  async created() {
    this.onAuth()
    this.lastVisiblePost = await this.firstGetPosts()
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
    async firstGetPosts() {
      if(this.user.uid) {
        const db = getFirestore()
        const postsCollection = collection(db, 'users', this.user.uid, 'posts')
        const q = query(postsCollection, orderBy('created_at', 'desc'), limit(10))
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
      }
    },
    async nextTaggedPosts(prelastVisiblePost) {
      if(this.user.uid) {
        const db = getFirestore()
        const postsCollection = collection(db, 'users', this.user.uid, 'posts')
        const nextPosts = query(postsCollection, orderBy('created_at', 'desc'), startAfter(prelastVisiblePost), limit(10))
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
  },
  computed: {
    ...mapGetters('auth', ['user']),
  },
  watch: {
    async user() {
      this.lastVisiblePost = await this.firstGetPosts()
    }
  }
}
</script>

<style scoped>
  @import '../css/style.css';

  .card-title {
    font-size: 16px;
    font-weight: bold;
  }
  .card-text {
    color: rgba(0, 0, 0, 0.6);
    font-size: 13px;
  }
  .link-style-none {
    color: #000;
    text-decoration: none;
  }
  .tag-style {
    color: #21BF73;
    font-size: 20px;
    font-weight: bold;
  }
</style>