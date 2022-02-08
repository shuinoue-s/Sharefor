<template>
  <div>
    <message-alert :message="signInMessage" type="success" />
    <message-alert :message="signOutErrorMessage" type="error" />
    <message-alert :message="postErrorMessage" type="error" />
    <message-alert :message="askErrorMessage" type="error" />
        
    <v-tabs align-with-title>
      <v-tabs-slider color="customLightGreen"></v-tabs-slider>

      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-tab href="#post-list" active-class="active" class="font">
        投稿
      </v-tab>
      
      <v-spacer></v-spacer>
      <v-tab href="#ask-list" active-class="active" class="font">
        募集
      </v-tab>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>

      <v-tab-item value="post-list">
        <post-list />
      </v-tab-item>

      <v-tab-item value="ask-list">
        <ask-list />
      </v-tab-item>
    </v-tabs>

    <v-btn v-if="isAuthenticated" @click="signOut" color="customPink" style="color: #fff;">ログアウト</v-btn>
  </div>
</template>

<script>
  import PostList from './PostList'
  import AskList from './AskList'
  import { mapGetters, mapActions } from 'vuex'
  import { getAuth, signOut } from "firebase/auth"
  import MessageAlert from '../components/MessageAlert'

  export default {
    name: 'Home',
    props: ['message'],
    components: {
      PostList,
      AskList,
      MessageAlert
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
      }
    },
    created() {
      this.onAuth()
    },
    methods: {
      ...mapActions('auth',['onAuth', 'isSignOut']),
      ...mapActions('alertMessage',['setSignOutMessage', 'setSignOutErrorMessage']),
      signOut() {
        const auth = getAuth()
        signOut(auth).then(() => {
          this.isSignOut()
          this.setSignOutMessage('ログアウトしました')
          this.$router.push({name: 'Login'})
        }).catch(() => {
          this.setSignOutErrorMessage('ログアウトに失敗しました')
        })
      },
    },
    computed: {
      ...mapGetters('auth', ['isAuthenticated']),
      ...mapGetters('alertMessage', ['signInMessage', 'signOutErrorMessage', 'postErrorMessage', 'askErrorMessage'])
    },
  }
</script>

<style scoped>
  @import '../css/style.css';

  .active  {
    color: #21BF73;
  }
</style>
