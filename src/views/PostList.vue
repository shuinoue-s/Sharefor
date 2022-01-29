<template>
  <div>
    <v-spacer></v-spacer>
    <v-container>
      <v-low class="d-sm-flex flex-sm-wrap">
        <v-col cols="12" sm="6" lg="4" v-for="post in posts" :key="post.uid">
          <v-card
            class="mx-auto rounded-0"
            max-width="344"
            color="customAlmostWhite"
          >
            <v-img
              :src="post.file_path"
              height="200px"
            ></v-img>

            <div class="d-flex mx-4 mt-2">
              <v-avatar class="my-auto">
                <img
                  :src="post.icon_path"
                  alt="John"
                >
              </v-avatar>

              <v-card-text class="card-text">
                @{{ post.uid }}
              </v-card-text>

              <v-card-text class="card-text">
                {{ post.created_at }}
              </v-card-text>
            </div>

            <v-divider class="mr-4" inset></v-divider>

            <v-card-text class="card-text py-2">
              {{ post.name }}
            </v-card-text>
            
            <v-divider class="mx-4"></v-divider>

            <v-card-title>
              {{ post.title }}
            </v-card-title>

            <v-card-subtitle>
              {{ post.body.slice(0, 20) + (post.body.length > 20 ? '...' : '') }}
            </v-card-subtitle>

            <v-card-actions>
              <v-btn
                color="customGreen"
                text
              >
                コメント
              </v-btn>

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
            <v-img
              src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
              height="200px"
            ></v-img>
              </div>
            </v-expand-transition>
          </v-card>
        </v-col>
      </v-low>
    </v-container>
    <v-spacer></v-spacer>
  </div>
</template>

<script>
import app from '../firebase/firebase'
import { getFirestore, collection, getDocs } from 'firebase/firestore'

export default {
  name: 'PostList',
  data() {
    return {
      db: null,
      posts: []
    }
  },
  created() {
    this.db = getFirestore(app)
    this.getPost()
  },
  methods: {
    async getPost() {
      const postsCol = collection(this.db, 'posts')
      const postSnapshot = await getDocs(postsCol)
      const postList = postSnapshot.docs.map(doc => doc.data())
      for(let i = 0; i < postList.length; i++) {
        postList[i].created_at = new Date(postList[i].created_at * 1000).toString().slice(16, 24)
      }
      this.posts = postList
    },
  },
  computed: {
  }
}
</script>

<style scoped>
  .card-text {
    color: rgba(0, 0, 0, 0.6);
    font-size: 13px;
  }
</style>