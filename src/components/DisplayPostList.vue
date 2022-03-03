<template>
  <div>
    <v-container>
      <slot />

      <v-row class="d-sm-flex flex-sm-wrap">
        <v-col cols="12" sm="6" lg="4" v-for="post in posts" :key="post.post_id">
          <v-card
            class="mx-auto rounded-0"
            max-width="344"
            color="customAlmostWhite"
          >
            <router-link :to="{ name: 'PostShow', params: { postId:post.post_id } }">
              <v-img
                :src="post.file_path"
                :alt="post.file_name"
                height="200px"
                lazy-src
              ></v-img>
            </router-link>

            <v-card-actions>
              <router-link
                :to="{ name: 'UserInfo', params: { userId:post.userInfo.user_id } }"
                class="link-style-none"
              >
                <v-avatar class="my-auto">
                  <img
                    :src="post.userInfo.icon_path"
                    :alt="post.userInfo.icon_name"
                  >
                </v-avatar>
              </router-link>

              <router-link
                :to="{ name: 'UserInfo', params: { userId:post.userInfo.user_id } }"
                class="link-style-none"
              >
                <v-card-text class="py-3">
                  <p class="user-name mb-0 ml-1">{{ post.userInfo.user_name.slice(0, 8) + (post.userInfo.user_name.length > 8 ? '...' : '') }}</p>
                  <p class="card-text mb-0">@{{ post.userInfo.user_id.slice(0, 14) + (post.userInfo.user_id.length > 14 ? '...' : '') }}</p>
                </v-card-text>
              </router-link>

              <v-card-text class="card-text py-3 text-end">
                {{ post.created_at }}
              </v-card-text>
            </v-card-actions>
            
            <v-divider class="mx-4"></v-divider>

            <v-card-actions>
              <router-link
                :to="{ name: 'PostShow', params: { postId:post.post_id } }"
                class="link-style-none"
              >
                <v-card-title class="card-title py-1">
                  {{ post.title.slice(0, 14) + (post.title.length > 14 ? '...' : '') }}
                </v-card-title>

                <v-card-subtitle class="my-0 pb-0">
                  {{ post.body.slice(0, 20) + (post.body.length > 20 ? '...' : '') }}
                </v-card-subtitle>
              </router-link>

              <v-spacer></v-spacer>

              <v-menu
                v-if="user.uid === post.uid"
                offset-y
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    color="gray"
                    class="mb-8"
                    v-bind="attrs"
                    v-on="on"
                  >{{ mdiDotsVertical }}</v-icon>
                </template>
                <v-list
                  class="menu-item py-0"
                  dense
                >
                  <v-list-item
                    @click="deletePost(post)"
                  >
                    削除
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-card-actions>

            <v-card-actions>
              <router-link
                :to="{ name: 'PostShow', params: { postId:post.post_id }, hash: '#comment' }"
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
  </div>
</template>

<script>
import { mdiCommentOutline, mdiDotsVertical } from '@mdi/js'
import GoogleMapAPI from '@/components/GoogleMapAPI'
import app from '@/firebase/firebase'
import { getFirestore, deleteDoc, doc } from 'firebase/firestore'
import { getStorage, ref, deleteObject } from 'firebase/storage'
import { mapGetters } from 'vuex'

export default {
  name: 'DisplayPostList',
  components: {
    GoogleMapAPI
  },
  props: {
    setPosts: {
      required: true,
      type: Array
    }
  },
  data() {
    return {
      mdiCommentOutline,
      mdiDotsVertical,
      posts: this.setPosts
    }
  },
  methods: {
    async deletePost(post) {
      const db = getFirestore(app)
      await deleteDoc(doc(db, 'users', post.uid, 'posts', post.post_id))
      const storage = getStorage()
      const storageRef = ref(storage, `users/${post.uid}/${post.file_name}`)
      deleteObject(storageRef).then(() => {
        this.$emit('delete-after')
      }).catch(() => {
      })
    }
  },
  computed: {
    ...mapGetters('auth', ['user'])
  },
  watch: {
    setPosts() {
      this.posts = this.setPosts
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
  .user-name {
    color: rgba(0, 0, 0, 0.6);
    font-size: 14px;
    font-weight: bold;
  }
  .card-text {
    color: rgba(0, 0, 0, 0.6);
    font-size: 13px;
  }
  .menu-item {
    font-size: 14px;
  }
  .link-style-none {
    color: #000;
    text-decoration: none;
  }
</style>
