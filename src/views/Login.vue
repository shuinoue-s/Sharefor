<template>
  <div>
    <message-alert :message="signOutMessage" type="success" />
    <message-alert :message="signInErrorMessage" type="error" />
    
    <v-progress-circular
    v-if="isLoading"
      indeterminate
      color="customGreen"
      class="position-center"
      size="50"
    ></v-progress-circular>

    <v-container v-if="!isLoading">
      <v-card class="mx-auto mt-4 font position-center">
        <v-card-actions>
          <v-col>
            <v-btn
            @click="signInTwitter"
            block
            class="text-transform py-4 my-4"
            style="color: #fff;"
            color="twitterColor"
            >
              <img src="@/assets/images/twitter-logo.svg" alt="TwitterLogo" width="15px" height="15px" class="mr-1">
              Twitterでログイン
            </v-btn>

            <!-- <v-btn
            @click="signInGoogle"
            block
            class="text-transform py-4 my-4"
            style="color: #fff"
            color="googleColor"
            >
              Googleでログイン
            </v-btn>

            <v-btn
            @click="signInEmail"
            block
            class="text-transform py-4 my-4"
            style="color: #fff"
            color="customGreen"
            >
              メールアドレスでログイン
            </v-btn> -->
            
            <v-btn
            block
            text
            class="text-transform py-4 my-2"
            color="customGreen"
            >
              新規登録はこちら
            </v-btn>
          </v-col>
        </v-card-actions>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import pathInfo from '@/modules/pathInfo'
import MessageAlert from '../components/MessageAlert'
import app from '../firebase/firebase'
import { TwitterAuthProvider, getAuth, signInWithRedirect, getRedirectResult, getAdditionalUserInfo } from 'firebase/auth'
import { doc, getFirestore, getDoc, setDoc,  serverTimestamp } from 'firebase/firestore'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Login',
  components: {
    MessageAlert
  },
  data() {
    return {
      twitterId: '',
      displayName: '',
      photoURL: ''
    }
  },
  created() {
    this.signInRedirect()
    this.errorStopRoading()
  },
  mounted() {
    this.getSignInResult()
  },
  methods: {
    ...mapActions('auth', ['setResult', 'onAuth']),
    ...mapActions('loading', ['loading', 'stopLoading']),
    ...mapActions('alertMessage', ['setSignInMessage', 'setSignInErrorMessage']),
    signInTwitter() {
        this.loading()
        const auth = getAuth()
        const provider = new TwitterAuthProvider()
        signInWithRedirect(auth, provider).catch(error => {
          if(error) {
            this.setErrorMessage()
          }
        })
    },
    getSignInResult() {
      const auth = getAuth()
      getRedirectResult(auth).then(result => {
        if(result) {
          const userInfo = getAdditionalUserInfo(result)
          this.sendUser(result.user.uid, userInfo.profile)
          this.setResult(result.user)
          this.setSignInMessage('ログインしました')
          this.stopLoading()
          this.$router.push({name: 'Home'})
        }
      }).catch(error => {
        if(error) {
          this.setErrorMessage()
        }
      })
    },
    setErrorMessage() {
        this.stopLoading()
        this.setSignInErrorMessage('ログインに失敗しました')
    },
    signInRedirect() {
      if(this.isAuthenticated) {
        this.$router.push({name: 'Home'})
      }
    },
    errorStopRoading() {
      setTimeout(() => {
        this.stopLoading()
      }, 6000)
    },
    async sendUser(uid, profile) {
      const iconPath = profile.profile_image_url_https
      const db = getFirestore(app)
      const userDocumentRef = doc(db, 'users', uid)
      const docSnap = await getDoc(userDocumentRef)
      if(!docSnap.exists()) {
        const postData = {
          uid: uid,
          user_id: profile.screen_name,
          user_name: profile.name,
          icon_name: iconPath ? pathInfo(iconPath).basename : iconPath,
          icon_path: iconPath,
          created_at: serverTimestamp()
        }
        await setDoc(userDocumentRef, postData).catch(() => {
          this.setSignInErrorMessage('ログインに失敗しました')
        })
      }
    }
  },
  computed: {
    ...mapGetters('loading', ['isLoading']),
    ...mapGetters('auth', ['isAuthenticated']),
    ...mapGetters('alertMessage', ['signInErrorMessage', 'signOutMessage'])
  }
}
</script>

<style scoped>
  @import '../css/style.css';

  *{ text-transform: none !important; }

  .position-center {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 90%;
    transform: translate(-50%, -50%);
  }

  @media screen and (min-width: 600px) {
    .position-center {
      width: 70%;
    }
  }

  @media screen and (min-width: 1000px) {
    .position-center {
      width: 45%;
    }
  }
</style>