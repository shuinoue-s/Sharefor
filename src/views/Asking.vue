<template>
  <div>
    <v-container>
      <v-row class="d-sm-flex flex-sm-wrap">
        <v-col cols="12" sm="6" lg="4" v-for="asking in askingList" :key="asking.ask_id">
          <v-sheet
            outlined
            color="customLightGreen"
            max-width="344"
            elevation="3"
            class="mx-auto"
          >
            <v-card
              class="mx-0 rounded-0"
              max-width="344"
              color="customAlmostWhite"
              outlined
            >
              <div class="d-flex justify-space-between mt-2 mx-4">
                <v-avatar class="my-auto">
                  <img
                    :src="asking.userInfo.icon_path"
                    :alt="asking.userInfo.icon_name"
                  >
                </v-avatar>

                <v-card-text class="card-text">
                  <p class="card-text mb-0">@{{ asking.userInfo.user_id.slice(0, 14) + (asking.userInfo.user_id.length > 14 ? '...' : '') }}</p>
                  <p class="card-text mb-0 ml-1">{{ asking.userInfo.user_name.slice(0, 8) + (asking.userInfo.user_name.length > 8 ? '...' : '') }}</p>
                </v-card-text>

                <v-card-text class="card-text">
                  {{ asking.created_at }}
                </v-card-text>
              </div>
              
              <v-divider class="mx-4"></v-divider>
              
              <router-link
                :to="{ name: 'AskShow', params: { id:asking.ask_id  } }"
                class="link-style-none"
              >

                <v-card-title class="card-title pt-3 pb-0 mb-0">
                  {{ asking.stadium }}
                </v-card-title>
                <p class="small-text mx-4">周辺のおすすめスポット</p>

                <v-card-subtitle class="py-0">
                  {{ asking.text.slice(0, 20) + (asking.text.length > 20 ? '...' : '') }}
                </v-card-subtitle>
              </router-link>

              <v-card-actions class="mt-2">
                <div class="d-flex justify-space-between mx-1" style="width: 100%">          
                  <v-btn
                    color="customGreen"
                    text
                  >
                    <v-icon
                      size="20"
                    >{{ mdiCommentOutline }}</v-icon>
                  </v-btn>

                  <v-sheet
                    outlined
                    rounded
                    color="customPink"
                  >
                    <v-card
                      color="customPink"
                      outlined
                      rounded
                    >
                      <v-card-text
                        class="font py-1"
                        style="color: #fff;"
                      >
                        <v-icon
                          color="white"
                          size="20"
                        >{{ mdiCommentSearchOutline }}</v-icon>
                        募集中
                      </v-card-text>
                    </v-card>
                  </v-sheet>
                </div>
              </v-card-actions>
            </v-card>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
    <v-spacer></v-spacer>

    <InfiniteLoading v-if="posted" ref="infiniteLoading" spinner="spiral" @infinite="infiniteLoad">
      <span slot="no-more"></span>
      <span slot="no-results"></span>
    </InfiniteLoading>
  </div>
</template>

<script>
import { arrayDateFormat, arrayAddUserInfo } from '@/modules/storeModifications'
import { mdiCommentSearchOutline, mdiCommentRemoveOutline, mdiCommentOutline } from '@mdi/js'
import InfiniteLoading from 'vue-infinite-loading'
import { ref } from 'vue'
import { getFirestore, getDocs, query, orderBy, collectionGroup, startAfter, limit, where } from 'firebase/firestore'

export default {
  name: 'Asking',
  head: {
    title: { inner: '募集中', separator: '-', complement: 'Sharefor' }
  },
  components: {
    InfiniteLoading
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
      askingList: []
    }
  },
  async created() {
    this.lastVisiblePost = await this.firstGetAsking()
    this.posted = true
  },
  methods: {
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
      const lastVisiblePost = querySnapshot.docs[querySnapshot.docs.length-1]
      let askingList = querySnapshot.docs.map(doc => doc.data())
      askingList = arrayDateFormat(askingList)
      this.askingList = await arrayAddUserInfo(askingList)
      return lastVisiblePost
    },
    async nextAsking(prelastVisiblePost) {
      const db = getFirestore()
      const askingCollectionGroup = collectionGroup(db, 'asks')
      const nextAsking = query(askingCollectionGroup, where('is_asking', '==', true), orderBy('created_at', 'desc'), startAfter(prelastVisiblePost), limit(10))
      const querySnapshot = await getDocs(nextAsking)
      const lastVisiblePost = querySnapshot.docs[querySnapshot.docs.length-1]
      let askingList = querySnapshot.docs.map(doc => doc.data())
      askingList = arrayDateFormat(askingList)
      askingList = await arrayAddUserInfo(askingList)
      this.askingList.push(...askingList)
      return lastVisiblePost
    }
  },
  computed: {
  }
}
</script>

<style scoped>
@import '../css/style.css';

  .card-title {
    font-size: 18px;
  }
  .card-text {
    color: rgba(0, 0, 0, 0.6);
    font-size: 13px;
  }
  .small-text {
    color: rgba(0, 0, 0, 0.6);
    font-size: 12px;
  }
  .link-style-none {
    color: #000;
    text-decoration: none;
  }
</style>

