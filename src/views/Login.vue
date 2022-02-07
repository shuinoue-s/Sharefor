<template>
  <div>
    <v-alert
      :value="errorMessage !== undefined"
      type="error"
      dense
      class="mt-0 text-center"
      transition="slide-y-transition"
    >
      {{errorMessage}}
    </v-alert>

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
import { TwitterAuthProvider, getAuth, signInWithRedirect, getRedirectResult } from "firebase/auth"
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Login',
  data() {
    return {
      errorMessage: undefined,
    }
  },
  created() {
    setTimeout(() => {
      this.stopLoading()
    },  6000)
  },
  mounted() {
    this.closeMessageThreeSecondsLater()
    this.getSignInResult()
  },
  methods: {
    ...mapActions('auth', ['setResult']),
    ...mapActions('loading', ['loading', 'stopLoading']),
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
          this.stopLoading()
          this.setResult(result.user)
          this.$router.push({name: 'Home', params: {message: 'ログインしました'}})
        }
      }).catch(error => {
        if(error) {
          this.setErrorMessage()
        }
      })
    },
    closeMessageThreeSecondsLater() {
      if(this.errorMessage !== undefined){
        setTimeout(() => {
          this.errorMessage = undefined
        }, 3000)
      }
    },
    setErrorMessage() {
        this.stopLoading()
        this.errorMessage = 'ログインに失敗しました'
        this.closeMessageThreeSecondsLater()
    },
  },
  computed: {
    ...mapGetters('loading', ['isLoading'])
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