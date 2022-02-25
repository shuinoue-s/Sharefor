<template>
  <div>
    <DisplayAskList
      v-if="asks"
      :setAsks="asks"
    />

    <InfiniteLoading v-if="posted" ref="infiniteLoading" spinner="spiral" @infinite="infiniteLoad">
      <span slot="no-more"></span>
      <span slot="no-results"></span>
    </InfiniteLoading>
  </div>
</template>

<script>
import { mdiCommentSearchOutline, mdiCommentRemoveOutline, mdiCommentOutline } from '@mdi/js'
import DisplayAskList from '@/components/DisplayAskList'
import { arrayDateFormat, arrayAddUserInfo } from '@/modules/storeModifications'
import InfiniteLoading from 'vue-infinite-loading'
import { ref } from 'vue'
import { getFirestore, getDocs, query, orderBy, collectionGroup, startAfter, limit, where } from 'firebase/firestore'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Asking',
  head: {
    title: { inner: '募集中', separator: '-', complement: 'Sharefor' }
  },
  components: {
    InfiniteLoading,
    DisplayAskList
  },
  setup() {
    const posted = ref(false)
    return { posted }
  },
  data() {
    return {
      mdiCommentSearchOutline,
      mdiCommentRemoveOutline,
      mdiCommentOutline,
      lastVisiblePost: {},
      posted: '',
      asks: null
    }
  },
  async created() {
    this.onAuth()
    this.lastVisiblePost = await this.firstGetAsking()
    this.posted = true
  },
  methods: {
    ...mapActions('auth', ['onAuth']),
    async infiniteLoad() {
      this.lastVisiblePost = await this.nextAsking(this.lastVisiblePost)
      this.$refs.infiniteLoading.stateChanger.loaded()
      if(!this.lastVisiblePost) {
        this.$refs.infiniteLoading.stateChanger.complete()
      }
    },
    async firstGetAsking() {
      const db = getFirestore()
      const askingCollectionGroup = collectionGroup(db, 'asks')
      const q = query(askingCollectionGroup, where('is_asking', '==', true), orderBy('created_at', 'desc'), limit(10))
      const querySnapshot = await getDocs(q)
      if(querySnapshot.size) {
        const lastVisiblePost = querySnapshot.docs[querySnapshot.docs.length-1]
        let asks = querySnapshot.docs.map(doc => doc.data())
        asks = arrayDateFormat(asks)
        this.asks = await arrayAddUserInfo(asks)
        return lastVisiblePost
      } else {
        return false
      }
    },
    async nextAsking(prelastVisiblePost) {
      const db = getFirestore()
      const askingCollectionGroup = collectionGroup(db, 'asks')
      const nextAsking = query(askingCollectionGroup, where('is_asking', '==', true), orderBy('created_at', 'desc'), startAfter(prelastVisiblePost), limit(10))
      const querySnapshot = await getDocs(nextAsking)
      if(querySnapshot.size) {
        const lastVisiblePost = querySnapshot.docs[querySnapshot.docs.length-1]
        let asks = querySnapshot.docs.map(doc => doc.data())
        asks = arrayDateFormat(asks)
        asks = await arrayAddUserInfo(asks)
        this.asks.push(...asks)
        return lastVisiblePost
      } else {
        return false
      }
    },
  },
  computed: {
    ...mapGetters('auth', ['user'])
  }
}
</script>

