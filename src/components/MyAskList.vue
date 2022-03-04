<template>
  <div>
    <v-container>
      <v-dialog
        v-model="dialog"
        width="350"
      >
        <v-card>
          <v-card-text class="font text-center pt-2 pb-1">
            募集を終了しますか？
          </v-card-text>
          <v-card-text class="dialog-text text-center pt-0 pb-4">
            ※一度募集を終了すると元には戻せません
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              class="font"
              color="customGreen"
              text
              @click="changeAsking"
            >
              はい
            </v-btn>
            <v-btn
              class="font ml-4"
              color="customGreen"
              text
              @click="dialog = false"
            >
              いいえ
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-row class="d-sm-flex flex-sm-wrap">
        <v-col cols="12" sm="6" lg="4" v-for="ask in asks" :key="ask.ask_id">
          <GreenLineVCard setMaxWidth="344" setMinHeight="295">
            <v-card-actions>
              <router-link
                :to="{ name: 'UserInfo', params: { userId:ask.userInfo.user_id } }"
                class="link-style-none"
              >
                <v-avatar
                  class="my-auto"
                  v-if="ask.userInfo.icon_path"
                >
                  <img
                    :src="ask.userInfo.icon_path"
                    :alt="ask.userInfo.icon_name"
                  >
                </v-avatar>
                <v-avatar
                  v-if="!ask.userInfo.icon_path"
                  class="my-auto"
                >
                  <v-icon
                    size="70"
                  >{{ mdiAccountCircle }}</v-icon>
                </v-avatar>
              </router-link>

              <router-link
                :to="{ name: 'UserInfo', params: { userId:ask.userInfo.user_id } }"
                class="link-style-none"
              >
                <v-card-text class="card-text">
                  <p class="user-name mb-0 ml-1">{{ ask.userInfo.user_name.slice(0, 8) + (ask.userInfo.user_name.length > 8 ? '...' : '') }}</p>
                  <p class="card-text mb-0">@{{ ask.userInfo.user_id.slice(0, 14) + (ask.userInfo.user_id.length > 14 ? '...' : '') }}</p>
                </v-card-text>
              </router-link>

              <v-card-text class="card-text text-end">
                {{ ask.created_at }}
              </v-card-text>
            </v-card-actions>
            
            <v-divider class="mx-4"></v-divider>
            
            <v-card-actions>
              <router-link
                :to="{ name: 'AskShow', params: { askId:ask.ask_id } }"
                class="link-style-none"
              >
                <v-card-title class="card-title pt-3 pb-0 mb-0">
                  {{ ask.stadium }}
                </v-card-title>
                <p class="small-text mx-4">周辺のおすすめスポット</p>

                <v-card-subtitle class="py-0">
                  {{ ask.text.slice(0, 20) + (ask.text.length > 20 ? '...' : '') }}
                </v-card-subtitle>
              </router-link>

              <v-spacer></v-spacer>

              <v-menu
                v-if="user.uid === ask.uid"
                offset-y
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    color="gray"
                    class="mb-12"
                    v-bind="attrs"
                    v-on="on"
                  >{{ mdiDotsVertical }}</v-icon>
                </template>
                <v-list
                  class="menu-item py-0"
                  dense
                >
                  <v-list-item
                    @click="deleteAsk(ask)"
                  >
                    削除
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-card-actions>

            <v-card-actions class="mt-2">
              <div class="d-flex justify-space-between align-end mx-1" style="width: 100%">    
                <router-link
                  :to="{ name: 'AskShow', params: { askId:ask.ask_id } }"
                  class="link-style-none"
                >  
                  <v-btn
                    color="customGreen"
                    text
                  >
                    <v-icon
                      size="20"
                    >{{ mdiCommentOutline }}</v-icon>
                  </v-btn>
                </router-link>

                <div v-if="ask.is_asking">
                  <v-card-text
                    class="font pb-0"
                    style="color: #F881DD"
                  >
                    <v-icon
                      color="customPink"
                      size="18"
                    >{{ mdiCommentSearchOutline }}</v-icon>
                    募集中
                  </v-card-text>
                  <v-btn
                    class="font"
                    style="color: #fff"
                    color="customPink"
                    @click="clickAsking(ask.ask_id)"
                  >
                    募集を終了する
                  </v-btn>
                </div>

                  <v-card
                    v-if="!ask.is_asking"
                    class="card-margin"
                    color="customGray"
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
                      >{{ mdiCommentRemoveOutline }}</v-icon>
                      募集終了
                    </v-card-text>
                  </v-card>
              </div>
            </v-card-actions>
          </GreenLineVCard>
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
import { mdiCommentOutline, mdiCommentSearchOutline, mdiCommentRemoveOutline, mdiDotsVertical, mdiAccountCircle } from '@mdi/js'
import GreenLineVCard from '@/components/GreenLineVCard'
import { arrayDateFormat, arrayAddUserInfo } from '@/modules/storeModifications'
import { getFirestore, query, getDocs, collection, limit, startAfter, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import InfiniteLoading from 'vue-infinite-loading'
import { ref } from 'vue'
import { mapActions, mapGetters } from 'vuex'
import app from '../firebase/firebase'

export default {
  name: 'MyAskList',
  components: {
    InfiniteLoading,
    GreenLineVCard
  },
  setup() {
    const posted = ref(false)
    return { posted }
  },
  data() {
    return {
      mdiCommentOutline,
      mdiCommentSearchOutline,
      mdiCommentRemoveOutline,
      mdiDotsVertical,
      mdiAccountCircle,
      posted: '',
      asks: null,
      dialog: false,
      changeAskingId: null
    }
  },
  async created() {
    this.onAuth()
    this.lastVisiblePost = await this.firstGetAsks()
    this.posted = true
  },
  methods: {
    ...mapActions('auth', ['onAuth']),
    async infiniteLoad() {
      this.lastVisiblePost = await this.nextAsks(this.lastVisiblePost)
      this.$refs.infiniteLoading.stateChanger.loaded()
      if(!this.lastVisiblePost) {
        this.$refs.infiniteLoading.stateChanger.complete()
      }
    },
    async firstGetAsks() {
      const db = getFirestore()
      const asksCollection = collection(db, 'users', this.user.uid, 'asks')
      const q = query(asksCollection, orderBy('created_at', 'desc'), limit(10))
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
    async nextAsks(prelastVisiblePost) {
      const db = getFirestore()
      const asksCollection = collection(db, 'users', this.user.uid, 'asks')
      const nextAsks = query(asksCollection, orderBy('created_at', 'desc'), startAfter(prelastVisiblePost),  limit(10))
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
    clickAsking(askId) {
      this.changeAskingId = askId
      this.dialog = true
    },
    changeAsking() {
      const db = getFirestore(app)
      const askDocRef = doc(db, 'users', this.user.uid, 'asks', this.changeAskingId)
      const askData = {
        is_asking: false
      }
      updateDoc(askDocRef, askData).then(async () => {
        this.lastVisiblePost = await this.firstGetAsks()
        this.dialog = false
      })
    },
    async deleteAsk(ask) {
      const db = getFirestore(app)
      await deleteDoc(doc(db, 'users', ask.uid, 'asks', ask.ask_id))
      this.lastVisiblePost = await this.firstGetAsks()
    },
  },
  computed: {
    ...mapGetters('auth', ['user']),
  },
  watch: {
    async user() {
      this.lastVisiblePost = await this.firstGetAsks()
    }
  }
}
</script>

<style scoped>
  @import '../css/style.css';

  .dialog-text {
    font-size: 12px;
  }
  .card-title {
    font-size: 16px;
    font-weight: bold;
  }
  .user-name {
    color: rgba(0, 0, 0, 0.6);
    font-size: 14px;
    font-weight: bold;
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
  .tag-style {
    color: #21BF73;
    font-size: 20px;
    font-weight: bold;
  }
  .card-margin {
    margin-top: 38.2px;
  }
</style>