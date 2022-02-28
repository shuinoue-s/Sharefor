<template>
  <div>
    <v-container>
      <slot />

      <v-row class="d-sm-flex flex-sm-wrap">
        <v-col cols="12" sm="6" lg="4" v-for="ask in asks" :key="ask.ask_id">
          <GreenLineVCard setMaxWidth="344">
            <v-card-actions>
              <router-link
                :to="{ name: 'UserInfo', params: { userId:ask.userInfo.user_id } }"
                class="link-style-none"
              >
                <v-avatar class="my-auto">
                  <img
                    :src="ask.userInfo.icon_path"
                    :alt="ask.userInfo.icon_name"
                  >
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
            
            <router-link
              :to="{ name: 'AskShow', params: { askId:ask.ask_id  } }"
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

                <!-- <div class="text-center">
                  <v-icon
                    v-if="true"
                    @click="favoriteBtnClicked(ask)"
                    color="yellow"
                  >{{ mdiStar }}</v-icon>
                  <v-icon
                    v-else
                    @click="favoriteBtnClicked(ask)"
                    color="yellow"
                  >{{ mdiStarOutline }}</v-icon>
                  <p class="mb-0 favo-text">いいね {{ ask.favo_count }}</p>
                </div> -->

                <v-spacer></v-spacer>

                <router-link
                  v-if="ask.is_asking"
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

                  <v-card
                    v-if="!ask.is_asking"
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
            </v-card-actions>
          </GreenLineVCard>
        </v-col>
      </v-row>
    </v-container>
    <v-spacer></v-spacer>
  </div>
</template>

<script>
import { mdiCommentSearchOutline, mdiCommentRemoveOutline, mdiCommentOutline, mdiStar, mdiStarOutline } from '@mdi/js'
import GreenLineVCard from '@/components/GreenLineVCard'
// import app from '../firebase/firebase'
// import { getFirestore, doc, writeBatch, serverTimestamp, getDoc, onSnapshot } from 'firebase/firestore'
import { mapGetters } from 'vuex'

export default {
  name: 'DisplayAskList',
  components: {
    GreenLineVCard,
  },
  props: {
    setAsks: {
      required: true,
      type: Array
    }
  },
  data() {
    return {
      mdiCommentSearchOutline,
      mdiCommentRemoveOutline,
      mdiCommentOutline,
      mdiStar,
      mdiStarOutline,
      asks: this.setAsks
    }
  },
  methods: {
    // async favoriteBtnClicked(ask) {
    //   if(ask && this.user) {
    //     const db = getFirestore(app)
    //     const batch = writeBatch(db)
    //     const likedAskDocRef = doc(db, 'users', ask.uid, 'asks', ask.ask_id, 'likedUsers', this.user.uid)
    //     const likedUserDocRef = doc(db, 'users', this.user.uid, 'likedAsks', ask.ask_id)
    //     const likedDocSnap = await getDoc(likedAskDocRef)
    //     const likedUserDocSnap = await getDoc(likedUserDocRef)
    //     this.isFavorite = likedUserDocSnap.exists()
    //     if(!likedDocSnap.exists() && !likedUserDocSnap.exists()) {
    //       batch.set(likedAskDocRef, {
    //         uid: this.user.uid,
    //         ask_id: ask.ask_id,
    //         created_at: serverTimestamp()
    //       })
    //       batch.set(likedUserDocRef, {
    //         uid: this.user.uid,
    //         ask_id: ask.ask_id,
    //         created_at: serverTimestamp()
    //       })
    //       await batch.commit()
    //       onSnapshot(doc(db, 'users', ask.uid, 'asks', ask.ask_id), (doc) => {
    //         ask.favo_count = doc.data().favo_count
    //       })
    //     } else {
    //       batch.delete(likedAskDocRef)
    //       batch.delete(likedUserDocRef)
    //       await batch.commit()
    //       onSnapshot(doc(db, 'users', ask.uid, 'asks', ask.ask_id), (doc) => {
    //         ask.favo_count = doc.data().favo_count
    //       })
    //     }
    //   }
    // }
  },
  computed: {
    ...mapGetters('auth', ['user'])
  },
  watch: {
    setAsks() {
      this.asks = this.setAsks
    }
  }
}
</script>

<style scoped>
  @import '../css/style.css';

  .card-title {
    font-size: 18px;
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
  .favo-text {
    color: rgba(0, 0, 0, 0.6);
    font-size: 12px;
  }
  .link-style-none {
    color: #000;
    text-decoration: none;
  }
</style>