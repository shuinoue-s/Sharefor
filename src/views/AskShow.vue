<template>
  <div>    
    <v-container class="container-width">
      <v-sheet
        outlined
        color="customLightGreen"
        class="mx-auto"
        elevation="3"
      >
        <v-card
          outlined
          color="white"
          class="rounded-0"
        >
          <v-card-title class="pt-2 pb-0">
            <h1 class="card-title">{{ ask.stadium }}</h1>
          </v-card-title>
          <p class="small-text mx-4 mb-3">周辺のおすすめスポット</p>

          <v-divider class="mx-4"></v-divider>
          
          <v-card-actions class="py-1">
              <v-avatar
                class="my-0 ml-2 mr-2"
                size="45"
                v-if="ask.userInfo"
              >
                <img
                  :src="ask.userInfo.icon_path"
                  :alt="ask.userInfo.icon_name"
                >
              </v-avatar>

              <p v-if="ask.userInfo" class="card-text mb-0 mr-4">@{{ ask.userInfo.user_id }}</p>
              <p v-if="ask.userInfo" class="card-text mb-0 mr-4">{{ ask.userInfo.user_name}}</p>
              <p class="card-text mb-0 ml-auto mr-4">{{ ask.created_at }}</p>
          </v-card-actions>

          <v-divider class="mx-4 mb-2"></v-divider>

          <v-card-text>
            <p class="body-style">{{ ask.text }}</p>
          </v-card-text>


          <div class="mt-4 text-center">
            <v-chip
              class="ma-2"
              color="customGreen"
              v-for="tag in  ask.tags"
              :key="tag"
              @click="clickTag(tag)"
            >
              <p style="color: #fff;" class="mb-0">{{ tag }}</p>
            </v-chip>
          </div>

          <v-card-actions>
            <div class="d-flex justify-space-between mx-1" style="width: 100%">
              <v-btn
                @click="showComment = !showComment"
                color="customGreen"
                text
              >
                <v-icon
                  size="25"
                >{{ mdiCommentOutline }}</v-icon>
              </v-btn>

              <router-link
                :to="{ name: 'Asking' }"
                class="link-style-none"
              >    
                <v-btn
                  class="font"
                  style="color: #fff"
                  color="customPink"
                >
                  <v-icon
                    color="white"
                    size="18"
                  >{{ mdiCommentSearchOutline }}</v-icon>
                  募集中
                </v-btn>
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

      <div id="comment"></div>

      <v-expand-transition>
        <AskComment
          v-show="showComment"
          :askId="this.askId"
        />
      </v-expand-transition>
    </v-container>
  </div>
</template>

<script>
import { mdiCommentOutline, mdiCommentSearchOutline, mdiCommentRemoveOutline } from '@mdi/js'
// import GoogleMapAPI from '@/components/GoogleMapAPI'
import AskComment from '@/components/AskComment'
import { dateFormat, splitTags, addUserInfo } from '@/modules/storeModifications'
import app from '@/firebase/firebase'
import { getFirestore, query, getDocs, collectionGroup, where } from 'firebase/firestore'
import { mapGetters, mapActions } from 'vuex'

const db = getFirestore(app)

export default {
  name: 'AskShow',
  components: {
    // GoogleMapAPI,
    AskComment
  },
  props: ['id'],
  data() {
    return {
      mdiCommentOutline,
      mdiCommentSearchOutline,
      mdiCommentRemoveOutline,
      askId: this.id,
      ask: [],
      tags: [],
      showComment: false,
      mapStyle: 'width: 390px; height: 300px;',
    }
  },
  created() {
    this.onAuth()
    this.getAsk()
  },
  methods: {
    ...mapActions('auth', ['onAuth']),
    async getAsk() {
      const asksCollectionGroup = collectionGroup(db, 'asks')
      const q = query(asksCollectionGroup, where('ask_id', '==', this.askId))
      const querySnapshot = await getDocs(q)
      const asks = querySnapshot.docs.map(doc => doc.data())
      let ask = await addUserInfo(asks[0])
      this.ask = dateFormat(ask)
      this.tags = splitTags(ask)
    },
    clickTag(tag) {
      this.$router.push({ name: 'TaggedAskList', params: {tag} })
    }
  },
  computed: {
    ...mapGetters('auth', ['user'])
  },
}
</script>

<style scoped>
  @import '../css/style.css';

  .container-width {
    width: 95%;
  }
  .width-full {
    width: 100%;
  }
  .card-title {
    font-size: 18px;
  }
  .card-text {
    color: rgba(0, 0, 0, 0.6);
    font-size: 13px;
  }
  .body-style {
    color: #000;
    white-space: pre-wrap;
  }
  .small-text {
    color: rgba(0, 0, 0, 0.6);
    font-size: 12px;
  }
  #map {
    width: 390px;
    margin: auto;
  }
  .link-style-none {
    color: #000;
    text-decoration: none;
  }

  @media screen and (min-width: 800px) {
    .container-width {
      width: 40%;
    }
    #map {
      width: 80%;
    }
  }
</style>