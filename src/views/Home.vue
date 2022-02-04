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
  </div>
</template>

<script>
  import PostList from './PostList'
  import  RecruitmentList from './RecruitmentList'

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
        successMessage: undefined
      }
    },
    mounted() {
      this.successMessage = this.message
      this.closeMessageThreeSecondsLater()
    },
    methods: {
      closeMessageThreeSecondsLater() {
        if(this.successMessage !== undefined){
          setTimeout(() => {
            this.successMessage = undefined
          }, 3000)
        }
      }
    }
  }
</script>

<style scoped>
@import '../css/style.css';

  .active  {
    color: #21BF73;
  }
</style>
