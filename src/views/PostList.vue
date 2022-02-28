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
import { mapGetters, mapActions } from 'vuex'
import DisplayPostList from '../components/DisplayPostList'
import InfiniteLoading from 'vue-infinite-loading'
import { ref } from 'vue'

export default {
  name: 'PostList',
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
      lastVisiblePost: {},
      posted: ''
    }
  },
  async created() {
    this.lastVisiblePost = await this.firstGetPosts()
    this.posted = true
  },
  methods: {
    ...mapActions('posts', ['firstGetPosts']),
    ...mapActions('posts', ['nextPosts']),
    async infiniteLoad() {
      this.lastVisiblePost = await this.nextPosts(this.lastVisiblePost)
      this.$refs.infiniteLoading.stateChanger.loaded()
      if(!this.lastVisiblePost) {
        this.$refs.infiniteLoading.stateChanger.complete()
      }
    },
  },
  computed: {
    ...mapGetters('posts', ['posts']),
    ...mapGetters('auth', ['user'])
  }
}
</script>