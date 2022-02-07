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
              <v-list-item v-on="listItemActivator.on" @click="recruitmentButtonClicked = !recruitmentButtonClicked">
                  <v-list-item-title class="text-center">募集</v-list-item-title>
              </v-list-item>
          </v-list>
          </v-menu>
  
        </template>

        <v-card v-show="postButtonClicked">
          <post-form
            @recieve-close="checkClicked"
            @recieve-send="checkClicked"
            @post-error="setMessage"
          />
        </v-card>

        <v-card v-show="recruitmentButtonClicked">
          <recruitment-form />
        </v-card>

      </v-dialog>
    </v-row>
    
  </div>
</template>

<script>
import PostForm from '../components/PostForm'
import RecruitmentForm from '../components/RecruitmentForm'
import jLeagueTeamList from '../jLeagueTeamList'

export default {
  name: 'Form',
  data() {
    return {
      db: null,
      dialog: false,
      postButtonClicked: false,
      recruitmentButtonClicked: false,
      postErrorMessage: undefined,
      recruitmentForm: {
        stadiums: jLeagueTeamList,
        text2: '',
        picker: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)
        // new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000))
      }
    }
  },
  methods: {
    checkClicked() {
      this.dialog = false 
      setTimeout(() => {
        this.postButtonClicked = false
        this.recruitmentButtonClicked = false
      }, 300)
    },
    setMessage(message) {
      console.log(message)
      this.postErrorMessage = message
    }
  },
  components: {
    PostForm,
    RecruitmentForm,
  },
}
</script>

<style scoped>

</style>