<template>
  <div>
    <v-tabs align-with-title>
      <v-tabs-slider color="customLightGreen"></v-tabs-slider>

      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-tab href="#post-list" active-class="active">
        投稿
      </v-tab>
      
      <v-spacer></v-spacer>
      <v-tab href="#recruitment-list" active-class="active">
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
  import PostList from '../components/PostList'
  import  RecruitmentList from '../components/RecruitmentList'

  export default {
    name: 'Home',

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
    }
  }
</script>

<style scoped>
  .active  {
    color: #21BF73;
  }
</style>
