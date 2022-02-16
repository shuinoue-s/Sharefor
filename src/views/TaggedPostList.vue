<template>
  <div>
    <v-container>
      <v-divider></v-divider>
      <div class="d-flex justify-center text-center">
        <v-icon color="customGreen">{{ mdiTagMultipleOutline }}</v-icon>
        <p class="tag-style mb-0">{{ $route.params.tag }}</p>
      </div>
      <v-divider class="mb-4"></v-divider>
      
      <v-row class="d-sm-flex flex-sm-wrap">
        <v-col cols="12" sm="6" lg="4" v-for="post in posts" :key="post.post_id">
          <v-card
            class="mx-auto rounded-0"
            max-width="344"
            color="customAlmostWhite"
          >
            <router-link :to="{ name: 'PostShow', params: { id:post.post_id  } }">
              <v-img
                :src="post.file_path"
                :alt="post.file_name"
                height="200px"
                lazy-src
              ></v-img>
            </router-link>

            <div class="d-flex justify-space-between mx-4 mt-0">
              <v-avatar class="my-auto">
                <img
                  :src="post.userInfo.icon_path"
                  :alt="post.userInfo.icon_name"
                >
              </v-avatar>

              <v-card-text class="py-3">
                <p class="card-text mb-0">@{{ post.userInfo.user_id.slice(0, 14) + (post.userInfo.user_id.length > 14 ? '...' : '') }}</p>
                <p class="card-text mb-0 ml-1">{{ post.userInfo.user_name.slice(0, 8) + (post.userInfo.user_name.length > 8 ? '...' : '') }}</p>
              </v-card-text>

              <v-card-text class="card-text py-3">
                {{ post.created_at }}
              </v-card-text>
            </div>
            
            <v-divider class="mx-4"></v-divider>

            <router-link
              :to="{ name: 'PostShow', params: { id:post.post_id } }"
              class="link-style-none"
            >
              <v-card-title class="card-title py-1">
                {{ post.title.slice(0, 14) + (post.title.length > 14 ? '...' : '') }}
              </v-card-title>

              <v-card-subtitle class="my-0 pb-0">
                {{ post.body.slice(0, 20) + (post.body.length > 20 ? '...' : '') }}
              </v-card-subtitle>
            </router-link>

            <v-card-actions>
              <router-link
                :to="{ name: 'PostShow', params: { id:post.post_id }, hash: '#comment' }"
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

              <v-spacer></v-spacer>

              <v-btn
                icon
                @click="post.is_show = !post.is_show"
              >
                <v-icon>{{ post.is_show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
              </v-btn>
            </v-card-actions>

            <v-expand-transition>
              <div v-show="post.is_show">
                <v-divider></v-divider>
                <GoogleMapAPI :geopoint="post.geopoint" />
              </div>
            </v-expand-transition>
          </v-card>
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
import { mdiTagMultipleOutline, mdiCommentOutline } from '@mdi/js'
import { arrayDateFormat, arrayAddUserInfo } from '@/modules/storeModifications'
import { getFirestore, query, getDocs, collectionGroup, where } from 'firebase/firestore'

export default {
  name: 'TaggedPostList',
  data() {
    return {
      mdiTagMultipleOutline,
      mdiCommentOutline,
      posts: []
    }
  },
  created() {
    this.getTaaggedPosts()
  },
  methods: {
    async getTaaggedPosts() {
      const db = getFirestore()
      const postsCollectionGroup = collectionGroup(db, 'posts')
      const q = query(postsCollectionGroup, where("tags", "array-contains", this.$route.params.tag))
      const querySnapshot = await getDocs(q)
      let posts = querySnapshot.docs.map(doc => doc.data())
      posts = await arrayAddUserInfo(posts)
      posts = arrayDateFormat(posts)
      this.posts = posts
    }
  }
}
</script>

<style scoped>
  @import '../css/style.css';

  .card-title {
    font-size: 16px;
    font-weight: bold;
  }
  .card-text {
    color: rgba(0, 0, 0, 0.6);
    font-size: 13px;
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