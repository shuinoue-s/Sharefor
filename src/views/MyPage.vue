<template>
  <div>
    <v-container class="container-width">
      <v-card
        outlined
        color="white"
      >
        <v-card-actions class="py-1 px-0 mx-4">
          <v-card-actions class="py-1 px-0">
              <v-avatar
                class="my-0 mr-2"
                size="50"
              >
                <img
                  :src="userInfo.icon_path"
                  :alt="userInfo.icon_name"
                >
              </v-avatar>
              <div>
                <p class="card-title mb-0">{{ userInfo.user_name}}</p>
                <p class="card-text mb-0">@{{ userInfo.user_id }}</p>
              </div>
          </v-card-actions>
          <v-spacer></v-spacer>
            <v-btn
              color="customGreen"
              style="color: #fff;"
              @click="clickEdit"
            >
              <v-icon>{{ mdiAccountEdit }}</v-icon>編集
            </v-btn>
        </v-card-actions>
      </v-card>

      <v-divider class="mx-4 mb-4"></v-divider>

      <v-tabs
        align-with-title
        v-model="tab"
        height="30"
      >
        <v-tabs-slider color="customLightGreen"></v-tabs-slider>

        <v-spacer></v-spacer>
        <v-tab href="#profile" active-class="active" class="font tab-style">
          プロフィール
        </v-tab>
        
        <v-spacer></v-spacer>
        <v-tab href="#my-post-list" active-class="active" class="font">
          投稿
        </v-tab>

        <v-spacer></v-spacer>
        <v-tab href="#my-ask-list" active-class="active" class="font">
          募集
        </v-tab>

        <v-spacer></v-spacer>
        <v-tab href="#" active-class="active" class="font">
          いいね
        </v-tab>
        <v-spacer></v-spacer>

        <v-tab-item value="profile">
          <Profile
            v-if="userInfo"
            :setUser="userInfo"
          />
        </v-tab-item>

        <v-tab-item value="my-post-list">
          <MyPostList />
        </v-tab-item>

        <v-tab-item value="my-ask-list">
          <MyAskList />
        </v-tab-item>

        <v-tab-item value="">
          <!-- < /> -->
        </v-tab-item>
      </v-tabs>
    </v-container>
    
    <MyPageForm
      ref="myPageForm"
      @get-profile="getUserInfo"
    />
  </div>
</template>

<script>
import { mdiAccountEdit } from '@mdi/js'
import Profile from '@/components/Profile'
import MyPostList from '@/components/MyPostList'
import MyAskList from '@/components/MyAskList'
import MyPageForm from '@/views/MyPageForm'
import { mapActions, mapGetters } from 'vuex'
import app from '../firebase/firebase'
import { getFirestore, doc, getDoc } from 'firebase/firestore'

export default {
  name: 'MyPage',
  components: {
    Profile,
    MyPostList,
    MyAskList,
    MyPageForm
  },
  data() {
    return {
      mdiAccountEdit,
      tab: 'profile',
      userInfo: '',
    }
  },
  created() {
    this.onAuth()
    this.getUserInfo()
  },
  methods: {
    ...mapActions('auth', ['onAuth']),
    async getUserInfo() {
      if(this.user) {
        const db = getFirestore(app)
        const docRef = doc(db, 'users', this.user.uid)
        const docSnap = await getDoc(docRef)
        this.userInfo = docSnap.data()
      }
    },
    clickEdit() {
      if(this.userInfo) {
        this.setChildData()
        this.$refs.myPageForm.isShowDialog()
      }
    },
    setChildData() {
      if(this.userInfo) {
        this.$refs.myPageForm.uid = this.userInfo.uid
        this.$refs.myPageForm.userName = this.userInfo.user_name
        this.$refs.myPageForm.userId = this.userInfo.user_id
        this.$refs.myPageForm.description = this.userInfo.description
        this.$refs.myPageForm.favoritePlace = this.userInfo.favorite_place
        this.$refs.myPageForm.selectedTeam = this.userInfo.favorite_team
        this.$refs.myPageForm.selectedPlayer = this.userInfo.favorite_player
        this.$refs.myPageForm.orignIconPath = this.userInfo.icon_path
        this.$refs.myPageForm.originIconName = this.userInfo.icon_name
        this.$refs.myPageForm.previewImage = this.userInfo.icon_path
      }
    }
  },
  computed: {
    ...mapGetters('auth', ['user']),
  },
  watch: {
    user() {
      this.getUserInfo()
    }
  }
}
</script>

<style scoped>
  @import '../css/style.css';

  .active  {
    color: #21BF73;
  }
  .tab-style {
    font-size: 12px;
  }
  .container-width {
    width: 95%;
  }
  .card-title {
    font-size: 18px;
  }
  .card-text {
    color: rgba(0, 0, 0, 0.6);
    font-size: 13px;
  }

  @media screen and (min-width: 800px) {
    .container-width {
      width: 80%;
    }
    .tab-style {
      font-size: 14px;
    }
  }
</style>