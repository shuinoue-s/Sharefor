<template>
  <div>
    <v-spacer></v-spacer>
    <v-container>
      <v-row class="d-sm-flex flex-sm-wrap">
        <v-col cols="12" sm="6" lg="4" v-for="post in posts" :key="post.id">
          <v-card
            class="mx-auto rounded-0"
            max-width="344"
            color="customAlmostWhite"
          >
            <v-img
              src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
              height="200px"
            ></v-img>

            <v-card-title>
              {{ post.title }}
            </v-card-title>

            <v-card-subtitle>
              {{ post.body.slice(0, 20) + (post.body.length > 20 ? '...' : '') }}
            </v-card-subtitle>

            <v-card-actions>
              <v-btn
                color="orange lighten-2"
                text
              >
                Explore
              </v-btn>

              <v-spacer></v-spacer>

              <v-btn
                icon
                @click="post.show = !post.show"
              >
                <v-icon>{{ post.show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
              </v-btn>
            </v-card-actions>

            <v-expand-transition>
              <div v-show="post.show">
                <v-divider></v-divider>

            <v-img
              src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
              height="200px"
            ></v-img>
              </div>
            </v-expand-transition>
          </v-card>
        </v-col>

       
      </v-row>
    </v-container>
    <v-spacer></v-spacer>
  </div>
</template>

<script>
export default {
  name: 'AskList',
   data() {
     return {
       posts: {
         post1: {
           id: 1,
          date: '2022-01-20',
          name: 'しゅーへー',
          title: '鹿島神宮',
          body: 'これは募集です',
          show: false,
          },
          post2: {
            id: 2,
            date: '2022-01-20',
            name: 'へーしゅー',
            title: '鹿島スタジアム',
            body: 'これは募集ですここめっちゃおすすめです！！！厳かな雰囲気でとても趣がありました。',
            show: false,
          },
          post3: {
            id: 3,
            date: '2022-01-20',
            name: 'へい',
            title: 'らあめんしかお',
            body: 'これは募集ですううううううううううう！！！！ここめっちゃおすすめです！！！厳かな雰囲気でとても趣がありました。',
            show: false,
          },        
          post4: {
            id: 4,
            date: '2022-01-20',
            name: 'へい',
            title: 'らあめんしかお',
            body: '鹿島あっっっっっっっslっっs神宮に行ってきました！ここめっちゃおすすめです！！！厳かな雰囲気でとても趣がありました。',
            show: false,
          },       
          post5: {
            id: 5,
            date: '2022-01-20',
            name: 'へい',
            title: 'らあめんしかお',
            body: '鹿島神宮に行ってきました！ここめっちゃおすすめです！！！厳かな雰囲気でとても趣がありました。',
            show: false,
          },       
          post6: {
            id: 6,
            date: '2022-01-20',
            name: 'へい',
            title: 'らあめんしかお',
            body: '鹿島神宮に行ってきました！ここめっちゃおすすめです！！！厳かな雰囲気でとても趣がありました。',
            show: false,
          },
        }
      }
    }
}
</script>

<style scoped>

</style>