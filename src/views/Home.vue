<template>
  <div>
    <MessageAlert :message="signInMessage" type="success" />
    <MessageAlert :message="signOutErrorMessage" type="error" />
    <MessageAlert :message="postErrorMessage" type="error" />
    <MessageAlert :message="askErrorMessage" type="error" />
        
    <v-tabs
      align-with-title
      v-model="tab"
    >
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
        <PostList />
      </v-tab-item>

      <v-tab-item value="ask-list">
        <AskList />
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
  import PostList from '@/views/PostList'
  import AskList from '@/views/AskList'
  import MessageAlert from '@/components/MessageAlert'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'Home',
    components: {
      PostList,
      AskList,
      MessageAlert
    },
    head: {
      title: { inner: 'Jリーグスタジアム周辺のおすすめスポットを共有しましょう', separator: '-', complement: 'Sharefor' }
    },
    data() {
      return {
        tab: this.$route.params.setTab
      }
    },
    created() {
      this.onAuth()
    },
    methods: {
       ...mapActions('auth',['onAuth']),
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
