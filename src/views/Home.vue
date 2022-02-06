<template>
  <div>
    <v-alert
      :value="successMessage !== undefined"
      type="success"
      dense
      class="mt-0 text-center"
      transition="slide-y-transition"
    >
      {{message}}
    </v-alert>

    <v-alert
      :value="signOutMessage !== undefined"
      type="success"
      dense
      class="mt-0 text-center"
      transition="slide-y-transition"
    >
      {{signOutMessage}}
    </v-alert>

    <v-alert
      :value="signOutErrorMessage !== undefined"
      type="error"
      dense
      class="mt-0 text-center"
      transition="slide-y-transition"
    >
      {{signOutErrorMessage}}
    </v-alert>
    
    <v-tabs align-with-title>
      <v-tabs-slider color="customLightGreen"></v-tabs-slider>

      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-tab href="#post-list" active-class="active" class="font">
        投稿
      </v-tab>
      
      <v-spacer></v-spacer>
      <v-tab href="#recruitment-list" active-class="active" class="font">
        募集
      </v-tab>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>

      <v-tab-item value="post-list">
        <post-list />
      </v-tab-item>

      <v-tab-item value="recruitment-list">
        <recruitment-list />
      </v-tab-item>
    </v-tabs>

    <v-btn v-if="isAuthenticated" @click="signOut" color="customPink" style="color: #fff;">ログアウト</v-btn>
  </div>
</template>

<script>
  import PostList from './PostList'
  import  RecruitmentList from './RecruitmentList'
  import { mapGetters, mapActions } from 'vuex'
  import { getAuth, signOut } from "firebase/auth"

  export default {
    name: 'Home',
    props: ['message'],
    components: {
      PostList,
      RecruitmentList
    },
    head: {
      title: {
        inner: 'Jリーグスタジアム周辺のおすすめスポットを共有しよう',
        separator: '-',
        complement: 'Sharefor'
      }
    },
    data() {
      return {
        successMessage: undefined,
        signOutMessage: undefined,
        signOutErrorMessage: undefined
      }
    },
    created() {
      this.onAuth()
    },
    mounted() {
      this.successMessage = this.message
      this.closeMessageThreeSecondsLater()
    },
    methods: {
      ...mapActions('auth',['onAuth', 'isSignOut']),
      closeMessageThreeSecondsLater() {
        if(this.successMessage !== undefined){
          setTimeout(() => {
            this.successMessage = undefined
          }, 3000)
        }
      },
      signOut() {
        const auth = getAuth()
        signOut(auth).then(() => {
          this.isSignOut()
          this.signOutMessage = 'ログアウトしました'
          if(this.signOutMessage !== undefined){
            setTimeout(() => {
              this.signOutMessage = undefined
            }, 3000)
          }
        }).catch(() => {
          this.signOutErrorMessage = 'ログアウトに失敗しました'
          this.closeMessageThreeSecondsLater(this.signOutErrorMessage)
          if(this.signOutErrorMessage !== undefined){
            setTimeout(() => {
              this.signOutErrorMessage = undefined
            }, 3000)
          }
        })
      },
    },
    computed: {
      ...mapGetters('auth', ['isAuthenticated'])
    },
  }
</script>

<style scoped>
@import '../css/style.css';

  .active  {
    color: #21BF73;
  }
</style>
