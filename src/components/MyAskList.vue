<template>
  <div>
    <v-container>
      <v-dialog
        v-model="dialog"
        width="350"
      >
        <v-card>
          <v-card-text class="font text-center pt-2 pb-1">
            本当に募集を終了しますか？
          </v-card-text>
          <v-card-text class="dialog-text text-center pt-0 pb-4">
            一度募集を終了すると元には戻せません。
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
        <v-col cols="12" sm="6" lg="4" v-for="ask in asksList" :key="ask.ask_id">
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
              <v-btn
                v-if="ask.is_asking"
                class="font"
                color="customPink"
                style="color: #fff"
                tile
                block
                @click="clickAsking(ask.ask_id)"
              >募集を終了する</v-btn>
              <div class="d-flex justify-space-between mt-2 mx-4">
                <v-avatar class="my-auto">
                  <img
                    :src="ask.userInfo.icon_path"
                    :alt="ask.userInfo.icon_name"
                  >
                </v-avatar>

                <v-card-text class="card-text">
                  <p class="card-text mb-0">@{{ ask.userInfo.user_id.slice(0, 14) + (ask.userInfo.user_id.length > 14 ? '...' : '') }}</p>
                  <p class="card-text mb-0 ml-1">{{ ask.userInfo.user_name.slice(0, 8) + (ask.userInfo.user_name.length > 8 ? '...' : '') }}</p>
                </v-card-text>

                <v-card-text class="card-text">
                  {{ ask.created_at }}
                </v-card-text>
              </div>
              
              <v-divider class="mx-4"></v-divider>
              
              <router-link
                :to="{ name: 'AskShow', params: { id:ask.ask_id } }"
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

              <v-card-actions class="mt-2">
                <div class="d-flex justify-space-between mx-1" style="width: 100%">    

                  <router-link
                    :to="{ name: 'AskShow', params: { id:ask.ask_id } }"
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

                  <router-link
                    :to="{ name: 'Asking' }"
                    class="link-style-none"
                  >    
                    <v-sheet
                      outlined
                      rounded
                      color="customPink"
                      v-if="ask.is_asking"
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
                  </router-link>

                  <v-sheet
                    outlined
                    rounded
                    color="customGray"
                    v-if="!ask.is_asking"
                  >
                    <v-card
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
import { mdiTagMultipleOutline, mdiCommentOutline, mdiCommentSearchOutline, mdiCommentRemoveOutline } from '@mdi/js'
import { arrayDateFormat, arrayAddUserInfo } from '@/modules/storeModifications'
import { getFirestore, query, getDocs, collection, limit, startAfter, orderBy, doc, updateDoc } from 'firebase/firestore'
import InfiniteLoading from 'vue-infinite-loading'
import { ref } from 'vue'
import { mapActions, mapGetters } from 'vuex'
import app from '../firebase/firebase'

export default {
  name: 'MyAskList',
  components: {
    InfiniteLoading
  },
  setup() {
    const posted = ref(false)
    return { posted }
  },
  data() {
    return {
      mdiTagMultipleOutline,
      mdiCommentOutline,
      mdiCommentSearchOutline,
      mdiCommentRemoveOutline,
      posted: '',
      asksList: [],
      dialog: false,
      changeAskingId: null
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
      const asksCollection = collection(db, 'users', this.user.uid, 'asks')
      const q = query(asksCollection, orderBy('created_at', 'desc'), limit(10))
      const querySnapshot = await getDocs(q)
      if(querySnapshot.size) {
        const lastVisiblePost = querySnapshot.docs[querySnapshot.docs.length-1]
        let asksList = querySnapshot.docs.map(doc => doc.data())
        asksList = arrayDateFormat(asksList)
        asksList = await arrayAddUserInfo(asksList)
        this.asksList = asksList
        return lastVisiblePost
      } else {
        return false
      }
    },
    async nextTaggedAsks(prelastVisiblePost) {
      const db = getFirestore()
      const asksCollection = collection(db, 'users', this.user.uid, 'asks')
      const nextAsks = query(asksCollection, orderBy('created_at', 'desc'), startAfter(prelastVisiblePost),  limit(10))
      const querySnapshot = await getDocs(nextAsks)
      if(querySnapshot.size) {
        const lastVisiblePost = querySnapshot.docs[querySnapshot.docs.length-1]
        let asksList = querySnapshot.docs.map(doc => doc.data())
        asksList = arrayDateFormat(asksList)
        asksList = await arrayAddUserInfo(asksList)
        this.asksList.push(...asksList)
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
      updateDoc(askDocRef, askData).then(() => {
        this.lastVisiblePost = this.firstGetTaggedAsks()
        this.dialog = false
      })
    }
  },
  computed: {
    ...mapGetters('auth', ['user']),
  },
  watch: {
    async user() {
      this.lastVisiblePost = await this.firstGetTaggedAsks()
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
</style>