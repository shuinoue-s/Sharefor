<template>
  <div>
    <v-container>
      <v-row class="d-sm-flex flex-sm-wrap">
        <v-col cols="12" sm="6" lg="4" v-for="ask in asks" :key="ask.ask_id">
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
                :to="{ name: 'AskShow', params: { id:ask.ask_id  } }"
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
                    :to="{ name: 'AskShow', params: { id:ask.ask_id  } }"
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
import { mdiCommentSearchOutline, mdiCommentRemoveOutline, mdiCommentOutline } from '@mdi/js'
import { mapActions, mapGetters } from 'vuex'
import InfiniteLoading from 'vue-infinite-loading'
import { ref } from 'vue'

export default {
  name: 'AskList',
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
      posted: ''
    }
  },
  async created() {
    this.lastVisiblePost = await this.firstGetAsks()
    this.posted = true
  },
  methods: {
    ...mapActions('asks', [('firstGetAsks')]),
    ...mapActions('asks', [('nextAsks')]),
    async infiniteLoad() {
      this.lastVisiblePost = await this.nextAsks(this.lastVisiblePost)
      this.$refs.infiniteLoading.stateChanger.loaded()
      if(!this.lastVisiblePost) {
        this.$refs.infiniteLoading.stateChanger.complete()
      }
    },
  },
  computed: {
    ...mapGetters('asks', ['asks'])
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