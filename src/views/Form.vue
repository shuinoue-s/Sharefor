<template>
  <div>
    <v-alert
      :value="postErrorMessage !== undefined"
      type="error"
      dense
      class="mt-0 text-center"
      transition="slide-y-transition"
    >
      {{postErrorMessage}}
    </v-alert>

    <v-alert
      :value="askErrorMessage !== undefined"
      type="error"
      dense
      class="mt-0 text-center"
      transition="slide-y-transition"
    >
      {{askErrorMessage}}
    </v-alert>
    
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
                  <v-list-item-title class="text-center">投稿</v-list-item-title>
              </v-list-item>
              <v-list-item v-on="listItemActivator.on" @click="askButtonClicked = !askButtonClicked">
                  <v-list-item-title class="text-center">募集</v-list-item-title>
              </v-list-item>
          </v-list>
          </v-menu>
  
        </template>

        <v-card v-show="postButtonClicked">
          <post-form
            @recieve-close="checkClicked"
            @recieve-send="checkClicked"
            @post-error="setPostMessage"
          />
        </v-card>

        <v-card v-show="askButtonClicked">
          <ask-form
            @recieve-close="checkClicked"
            @recieve-send="checkClicked"
            @ask-post-error="setAskMessage"
           />
        </v-card>

      </v-dialog>
    </v-row>
    
  </div>
</template>

<script>
import PostForm from '../components/PostForm'
import AskForm from '../components/AskForm'

export default {
  name: 'Form',
  data() {
    return {
      db: null,
      dialog: false,
      postButtonClicked: false,
      askButtonClicked: false,
      postErrorMessage: undefined,
      askErrorMessage: undefined
    }
  },
  methods: {
    checkClicked() {
      this.dialog = false 
      setTimeout(() => {
        this.postButtonClicked = false
        this.askButtonClicked = false
      }, 300)
    },
    setPostMessage(message) {
      this.postErrorMessage = message
    },
    setAskMessage(message) {
      this.askErrorMessage = message
    }
  },
  components: {
    PostForm,
    AskForm,
  },
}
</script>