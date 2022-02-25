<template>
  <div>
    <DisplayAskList
      v-if="asks"
      :setAsks="asks"
    >
      <v-divider></v-divider>
      <div class="d-flex justify-center text-center">
        <v-icon color="customGreen">{{ mdiTagMultipleOutline }}</v-icon>
        <p class="tag-style mb-0">{{ $route.params.tag }}</p>
      </div>
      <v-divider class="mb-4"></v-divider>
    </DisplayAskList>

    <InfiniteLoading v-if="posted" ref="infiniteLoading" spinner="spiral" @infinite="infiniteLoad">
      <span slot="no-more"></span>
      <span slot="no-results"></span>
    </InfiniteLoading>
  </div>
</template>

<script>
import { mdiTagMultipleOutline } from '@mdi/js'
import DisplayAskList from '@/components/DisplayAskList'
import { arrayDateFormat, arrayAddUserInfo } from '@/modules/storeModifications'
import { getFirestore, query, getDocs, collectionGroup, where, limit, startAfter, orderBy } from 'firebase/firestore'
import InfiniteLoading from 'vue-infinite-loading'
import { ref } from 'vue'
import { mapActions } from 'vuex'

export default {
  name: 'TaggedAskList',
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
      mdiTagMultipleOutline,
      posted: '',
      asks: null
    }
  },
  async created() {
    this.onAuth()
    this.lastVisiblePost = await this.firstGetTaggedAsks()
    this.posted = true
  },
  methods: {
    ...mapActions('auth', ['onAuth']),
    async infiniteLoad() {
      this.lastVisiblePost = await this.nextTaggedAsks(this.lastVisiblePost)
      this.$refs.infiniteLoading.stateChanger.loaded()
      if(!this.lastVisiblePost) {
        this.$refs.infiniteLoading.stateChanger.complete()
      }
    },
    async firstGetTaggedAsks() {
      const db = getFirestore()
      const asksCollectionGroup = collectionGroup(db, 'asks')
      const q = query(asksCollectionGroup, where("tags", "array-contains", this.$route.params.tag), orderBy('created_at', 'desc'), limit(10))
      const querySnapshot = await getDocs(q)
      if(querySnapshot.size) {
        const lastVisiblePost = querySnapshot.docs[querySnapshot.docs.length-1]
        let asks = querySnapshot.docs.map(doc => doc.data())
        asks = arrayDateFormat(asks)
        asks = await arrayAddUserInfo(asks)
        this.asks = asks
        return lastVisiblePost
      } else {
        return false
      }
    },
    async nextTaggedAsks(prelastVisiblePost) {
      const db = getFirestore()
      const asksCollectionGroup = collectionGroup(db, 'asks')
      const nextAsks = query(asksCollectionGroup, where("tags", "array-contains", this.$route.params.tag), orderBy('created_at', 'desc'), startAfter(prelastVisiblePost),  limit(10))
      const querySnapshot = await getDocs(nextAsks)
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