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
          <v-card-title class="pb-0">
            <h1 class="card-title">{{ post.title }}</h1>
          </v-card-title>
          
          <v-card-actions class="py-0">
            <div class="d-flex justify-space-between px-2 mx-auto width-full"> 
              <v-avatar class="my-auto">
                <img
                  :src="post.icon_path"
                  :alt="post.icon_name"
                >
              </v-avatar>

              <div>
                <v-card-text class="card-text pb-0">
                  @{{ post.uid }}
                </v-card-text>
                <v-card-text class="card-text pt-0">
                  {{ post.user_name }}
                </v-card-text>
              </div>

              <v-card-text class="card-text text-right">
                {{ post.created_at }}
              </v-card-text>
            </div>
          </v-card-actions>

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
              v-for="tag in  post.tags"
              :key="tag"
            >
              <p style="color: #fff;" class="mb-0">{{ tag }}</p>
            </v-chip>
          </div>

          <v-card-actions>
            <v-btn
              color="customGreen"
              text
            >
              コメント
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-sheet>
    </v-container>
  </div>
</template>

<script>
import GoogleMapAPI from '@/components/GoogleMapAPI'
import { dateFormat, splitTags } from '@/modules/methodsUsedInVuex'
import app from '@/firebase/firebase'
import { getFirestore, getDoc, doc } from 'firebase/firestore'
import { mapGetters, mapActions } from 'vuex'

const db = getFirestore(app)

export default {
  name: 'PostShow',
  components: {
    GoogleMapAPI
  },
  data() {
    return {
      post: [],
      tags: [],
      mapStyle: 'width: 390px; height: 300px;'
    }
  },
  created() {
    this.onAuth()
    this.getPost()
  },
  methods: {
    ...mapActions('auth', ['onAuth']),
    async getPost() {
      if(this.user) {
        const postDocument = doc(db, 'users', this.user.uid, 'posts', this.$route.params.id)
        const postSpan = await getDoc(postDocument)
        let post = postSpan.data()
        this.post = dateFormat(post)
        this.tags = splitTags(post)
      }
    },
  },
  computed: {
    ...mapGetters('auth', ['user'])
  },
  watch: {
    user() {
      this.getPost()
    }
  }
}
</script>

<style scoped>
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
      width: 50%;
    }
    #map {
      width: 80%;
    }
  }
</style>