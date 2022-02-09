<template>
  <div>    
    <v-row justify="center">
      <v-dialog
        v-model="dialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <template v-slot:activator="listItemActivator">
          <v-menu
            offset-x
            left
            min-width="100"
            transition="slide-y-reverse-transition"
          >
          <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="mr-2 mb-2"
            color="customGreen"
            fab
            dark
            fixed
            right
            bottom
            v-bind="attrs"
            v-on="on"
          >
            <v-icon dark>
              mdi-plus
            </v-icon>
          </v-btn>
          </template>
          <v-list>
              <v-list-item v-on="listItemActivator.on" @click="postButtonClicked = !postButtonClicked">
                  <v-list-item-title class="font color text-center">投稿</v-list-item-title>
              </v-list-item>
              <v-list-item v-on="listItemActivator.on" @click="askButtonClicked = !askButtonClicked">
                  <v-list-item-title class="font color text-center" >募集</v-list-item-title>
              </v-list-item>
          </v-list>
          </v-menu>
  
        </template>

        <v-card v-show="postButtonClicked">
          <post-form
            @recieve-close="checkClicked"
            @recieve-send="checkClicked"
          />
        </v-card>

        <v-card v-show="askButtonClicked">
          <ask-form
            @recieve-close="checkClicked"
            @recieve-send="checkClicked"
           />
        </v-card>

      </v-dialog>
    </v-row>
    
  </div>
</template>

<script>
import PostForm from '../components/PostForm'
import AskForm from '../components/AskForm'
import { mapActions } from 'vuex'

export default {
  name: 'Form',
  components: {
    PostForm,
    AskForm
  },
  data() {
    return {
      db: null,
      dialog: false,
      postButtonClicked: false,
      askButtonClicked: false
    }
  },
  created() {
    this.getPosts()
    this.getAsks()
  },
  methods: {
    ...mapActions('posts', ['getPosts']),
    ...mapActions('asks', ['getAsks']),
    checkClicked() {
      this.dialog = false 
      setTimeout(() => {
        this.postButtonClicked = false
        this.askButtonClicked = false
      }, 300)
    }
  }
}
</script>

<style scoped>
  @import '../css/style.css';

  .color {
    color: rgb(33, 191, 115);
  }
</style>