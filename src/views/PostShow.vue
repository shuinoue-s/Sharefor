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
            <h1 class="card-title">{{ post.title }}</h1>
          </v-card-title>
          
          <v-card-actions class="py-1">
              <v-avatar
                class="my-0 ml-2 mr-2"
                size="45"
              >
                <img
                  :src="post.userInfo.icon_path"
                  :alt="post.userInfo.icon_name"
                >
              </v-avatar>

              <p class="card-text mb-0 mr-4">@{{ post.userInfo.user_id }}</p>
              <p class="card-text mb-0 mr-4">{{ post.userInfo.user_name}}</p>
              <p class="card-text mb-0 ml-auto mr-4">{{ post.created_at }}</p>
          </v-card-actions>

          <v-divider class="mx-4 mb-2"></v-divider>

          <v-img
            :src="post.file_path"
            :alt="post.file_name"
            class="mx-auto"
            style="border-radius: 0"
            max-width="390px"
          ></v-img>

          <v-card-text>
            <p class="body-style">{{ post.body }}</p>
          </v-card-text>

          <div id="map" v-if="post.geopoint">
            <GoogleMapAPI :geopoint="post.geopoint" :mapStyle="mapStyle" />
          </div>

          <div class="mt-4 text-center">
            <v-chip
              class="ma-2"
              color="customGreen"
              v-for="tag in post.tags"
              :key="tag"
              @click="clickTag(tag)"
            >
              <p style="color: #fff;" class="mb-0">{{ tag }}</p>
            </v-chip>
          </div>

          <v-card-actions>
            <v-btn
              @click="showComment = !showComment"
              color="customGreen"
              text
            >
              <v-icon
                size="25"
              >{{ mdiCommentOutline }}</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-sheet>

      <div id="comment"></div>

      <v-expand-transition>
        <PostComment
          v-show="showComment"
          :postId="this.postId"
        />
      </v-expand-transition>
    </v-container>
  </div>
</template>

<script>
import { mdiCommentOutline } from '@mdi/js'
import GoogleMapAPI from '@/components/GoogleMapAPI'
import PostComment from '@/components/PostComment'
import { dateFormat, splitTags, addUserInfo } from '@/modules/storeModifications'
import app from '@/firebase/firebase'
import { getFirestore, query, getDocs, collectionGroup, where } from 'firebase/firestore'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'PostShow',
  components: {
    GoogleMapAPI,
    PostComment
  },
  props: ['id'],
  data() {
    return {
      mdiCommentOutline,
      postId: this.id,
      post: [],
      tags: [],
      showComment: false,
      mapStyle: 'width: 390px; height: 300px;',
    }
  },
  created() {
    this.onAuth()
    this.getPost()
  },
  methods: {
    ...mapActions('auth', ['onAuth']),
    async getPost() {
      const db = getFirestore(app)
      const postsCollectionGroup = collectionGroup(db, 'posts')
      const q = query(postsCollectionGroup, where('post_id', '==', this.postId))
      const querySnapshot = await getDocs(q)
      const posts = querySnapshot.docs.map(doc => doc.data())
      let post = await addUserInfo(posts[0])
      this.post = dateFormat(post)
      this.tags = splitTags(post)
    },
    clickTag(tag) {
      this.$router.push({ name: 'TaggedPostList', params: {tag} })
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
  #map {
    width: 390px;
    margin: auto;
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