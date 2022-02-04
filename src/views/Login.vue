<template>
  <div>
      <v-alert
        :value="errorMessage !== undefined"
        type="error"
        dense
        class="mt-0 text-center"
        transition="slide-y-transition"
      >
        {{message}}
      </v-alert>

     <v-container>
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
import { TwitterAuthProvider, getAuth, signInWithRedirect } from "firebase/auth"

export default {
  name: 'Login',
  props: ['message'],
  data() {
    return {
      errorMessage: undefined
    }
  },
  mounted() {
    this.errorMessage = this.message
    this.closeMessageThreeSecondsLater()
  },
  methods: {
    signInTwitter() {
      const auth = getAuth()
      const provider = new TwitterAuthProvider()
      signInWithRedirect(auth, provider)
      this.$router.push('/login/loading')
    },
    closeMessageThreeSecondsLater() {
      if(this.errorMessage !== undefined){
        setTimeout(() => {
          this.errorMessage = undefined
        }, 3000)
      }
    }
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