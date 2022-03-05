<template>
  <div>
    <v-container class="container-width">
    <v-text-field
      outlined
      dense
      clearable
      class="mt-4"
      color="customGreen"
      v-model="keyword"
      @input="onChangeInput"
      label="検索したいキーワードを入力してください"
    ></v-text-field>

    <!-- <div v-if="searchResultUser">
      <GreenLineVCard
        v-for="user in searchResultUser"
        :key="user.user_id"
        class="pt-1"
      >
      </GreenLineVCard>
    </div> -->

    <div v-if="searchResultPost">
      <GreenLineVCard
        v-for="post in searchResultPost"
        :key="post.post_id"
        class="pt-1"
      >
        <router-link
          :to="{ name: 'PostShow', params: { postId:post.post_id } }"
          class="link-style-none"
        >
          <v-card-actions
            class="pa-1 pb-0"
          >
            <v-img
              :src="post.file_path"
              :alt="post.file_name"
              max-width="70"
              max-height="70"
              lazy-src
              class="mb-1"
            ></v-img>

            <div>
              <v-card-title class="card-title py-0">
                {{ post.title.slice(0, 14) + (post.title.length > 14 ? '...' : '') }}
              </v-card-title>

              <v-card-subtitle class="card-text my-0 pb-0">
                {{ post.body.slice(0, 20) + (post.body.length > 20 ? '...' : '') }}
              </v-card-subtitle>
            </div>
          </v-card-actions>
        </router-link>

        <v-divider class="mx-4"></v-divider>
        
        <div class="text-center pa-1 pt-0">
          <v-chip
            x-small
            color="customGreen"
            class="mx-1"
            v-for="tag in post.tags"
            :key="tag"
            @click="clickPostTag(tag)"
          >
            <p style="color: #fff;" class="mb-0">{{ tag }}</p>
          </v-chip>
        </div>
      </GreenLineVCard>
    </div>

    <div v-if="searchResultAsk">
      <GreenLineVCard
        v-for="ask in searchResultAsk"
        :key="ask.ask_id"
        class="pt-1"
      >
        <v-card-actions class="pa-1 pb-0 justify-end">
          <router-link
            :to="{ name: 'AskShow', params: { askId:ask.ask_id } }"
            class="link-style-none mr-auto"
            style="width: 100%"
          >
            <div class="pa-0">
              <v-card-title class="card-title pa-0">
                {{ ask.stadium }}
              </v-card-title>
              <p class="small-text mb-0 ml-1">周辺のおすすめスポット</p>
            </div>
            
            <v-card-subtitle class="py-0">
              {{ ask.text.slice(0, 20) + (ask.text.length > 20 ? '...' : '') }}
            </v-card-subtitle>
          </router-link>
          
          <router-link
            v-if="ask.is_asking"
            :to="{ name: 'Asking' }"
            class="link-style-none"
          >    
            <v-btn
              class="font mb-8"
              style="color: #fff"
              color="customPink"
              small
            >
              <v-icon
                color="white"
                size="18"
              >{{ mdiCommentSearchOutline }}</v-icon>
              募集中
            </v-btn>
          </router-link>

          <v-btn
            v-if="!ask.is_asking"
            class="font mb-8"
            style="color: #fff;"
            color="customGray"
            depressed
            disabled
            small
          >
            <v-icon
              color="white"
              size="20"
            >{{ mdiCommentRemoveOutline }}</v-icon>
            募集終了
          </v-btn>
        </v-card-actions>

        <v-divider class="mx-4"></v-divider>

        <div class="text-center pa-1 pt-0">
          <v-chip
            x-small
            class="mx-1"
            color="customGreen"
            v-for="tag in  ask.tags"
            :key="tag"
            @click="clickAskTag(tag)"
          >
            <p style="color: #fff;" class="mb-0">{{ tag }}</p>
          </v-chip>
        </div>
      </GreenLineVCard>
    </div>
    </v-container>
  </div>
</template>

<script>
import { mdiCommentSearchOutline, mdiCommentRemoveOutline } from '@mdi/js'
import GreenLineVCard from '@/components/GreenLineVCard'
import algoliasearch from 'algoliasearch'

export default {
  name: 'Search',
  components: {
    GreenLineVCard
  },
  head: {
    title: { inner: '検索', separator: '-', complement: 'Sharefor' }
  },
  data() {
    return {
      mdiCommentSearchOutline,
      mdiCommentRemoveOutline,
      keyword: null,
      searchResultUser: null,
      searchResultPost: null,
      searchResultAsk: null
    }
  },
  methods: {
    async onChangeInput(input) {
      if(!input) {
        this.keyword = null
        this.searchResultUser = null
        this.searchResultPost = null
        this.searchResultAsk = null
      } else {
          const algoliaId = 'ZPBZS0LVL1'
          const algoliaKey = 'd90da7dd0304b5b616f96311ce8160c1'
          const client = algoliasearch(algoliaId, algoliaKey)
          const userIndex = client.initIndex('users')
          const postIndex = client.initIndex('posts')
          const askIndex = client.initIndex('asks')
          const userResult = await userIndex.search(input)
          const postResult = await postIndex.search(input)
          const askResult = await askIndex.search(input)
        if(userResult || postResult || askResult) {
          if(userResult) {
            this.searchResultUser = userResult.hits.map(hit => hit)
          } else {
            this.searchResultUser = null
          }
          if(postResult) {
            this.searchResultPost = postResult.hits.map(hit => hit)
          } else {
            this.searchResultPost = null
          }
          if(askResult) {
            this.searchResultAsk = askResult.hits.map(hit => hit)
          } else {
            this.searchResultAsk = null
          }
        } else {
          this.searchResultUser = null
          this.searchResultPost = null
          this.searchResultAsk = null
        }
      }
    },
    clickPostTag(tag) {
      this.$router.push({ name: 'TaggedPostList', params: {tag} })
    },
    clickAskTag(tag) {
      this.$router.push({ name: 'TaggedAskList', params: {tag} })
    },
  }
}
</script>

<style scoped>
  @import '../css/style.css';

  .container-width {
    width: 95%;
  }
  .card-title {
    font-size: 14px;
  }
  .card-text {
    color: rgba(0, 0, 0, 0.6);
    font-size: 12px;
  }
  .small-text {
    color: rgba(0, 0, 0, 0.6);
    font-size: 12px;
  }
  .link-style-none {
    color: #000;
    text-decoration: none;
  }

  @media screen and (min-width: 700px) {
    .container-width {
      width: 60%;
    }
  }
</style>
