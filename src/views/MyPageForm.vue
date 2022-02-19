<template>
  <div>
    <v-row justify="center">
      <v-dialog
        v-model="dialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <v-card>
          <validation-observer
            ref="observer"
            v-slot="{ invalid }"
          >
            <form @submit.prevent="sendProfile">
              <v-toolbar
                dark
                color="customGreen"
                dense
              >
                <v-btn
                  icon
                  dark
                  @click="isShowDialog"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title class="font mx-auto" style="color: #B0EACD;">編集</v-toolbar-title>
                <v-toolbar-items>
                  <v-btn
                    dark
                    text
                    type="submit"
                    :disabled="invalid"
                  >
                    <v-icon>{{ mdiContentSaveOutline }}</v-icon>保存
                  </v-btn>
                </v-toolbar-items>
              </v-toolbar>
              <v-container class="container-width px-0 mt-4">
                <validation-provider
                  v-slot="{ errors }"
                  name="user-name"
                  rules="required|max:50"
                >
                  
                  <v-text-field
                    v-model="userName"
                    :error-messages="errors"
                    label="名前"
                    required
                    outlined
                    dense
                    color="customGreen"
                  ></v-text-field>
                </validation-provider>

                <validation-provider
                  v-slot="{ errors }"
                  name="user-id"
                  rules="required|max:15"
                >
                  <v-text-field
                    v-model="userId"
                    :error-messages="errors"
                    label="ユーザーID"
                    required
                    outlined
                    dense
                    color="customGreen"
                  ></v-text-field>
                </validation-provider>

                <validation-provider
                  v-slot="{ errors }"
                  name="description"
                  rules="required|max:300"
                >
                  <v-textarea
                    v-model="description"
                    :counter="300"
                    :error-messages="errors"
                    label="自己紹介"
                    required
                    outlined
                    dense
                    color="customGreen"
                  ></v-textarea>
                </validation-provider>

                <validation-provider
                  v-slot="{ errors }"
                  name="favorite-place"
                  rules="required|max:50"
                >
                  <v-text-field
                    v-model="favoritePlace"
                    :error-messages="errors"
                    label="お気に入りの場所"
                    required
                    outlined
                    dense
                    color="customGreen"
                  ></v-text-field>
                </validation-provider>

                <validation-provider
                  v-slot="{ errors }"
                  name="favorite-team"
                  rules="required|max:50|maxlength:3"
                >
                  <v-select
                    v-model="selectedTeam"
                    :items="teamItems"
                    item-text="name"
                    item-value="name"
                    :error-messages="errors"
                    label="推しチーム"
                    hint="3チームまで入力可能"
                    persistent-hint
                    required
                    outlined
                    dense
                    multiple
                    small-chips
                    deletable-chips
                    clearable
                    color="customGreen"
                  ></v-select>
                </validation-provider>

                <validation-provider
                  v-slot="{ errors }"
                  name="favorite-player"
                  rules="required|max:30|maxlength:3"
                >
                  <v-combobox
                    :error-messages="errors"
                    v-model="selectedPlayer"
                    :items="favoritePlayer"
                    label="推し選手"
                    hint="3選手まで入力可能"
                    persistent-hint
                    color="customGreen"
                    item-color="customGreen"
                    multiple
                    outlined
                    dense
                    small-chips
                    deletable-chips
                    clearable
                  >
                  </v-combobox>
                </validation-provider>
              </v-container>
            </form>
          </validation-observer>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import { mdiContentSaveOutline } from '@mdi/js'
import jLeagueTeamList from '@/jLeagueTeamList'
import { required, max } from 'vee-validate/dist/rules'
import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'
import app from '../firebase/firebase'
import { getFirestore, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { mapActions } from 'vuex'

  setInteractionMode('eager')
  extend('required', {
    ...required,
    message: '入力必須です',
  })
  extend('max', {
    ...max,
    message: '{length}文字以内で入力してください',
  })
  extend('maxlength', {
    validate: (select, {max}) => {
      return select.length <= max
    },
    params: ['max'],
    message: '最大{max}個まで入力可能です'
  })

export default {
  name: 'MyPageForm',
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      mdiContentSaveOutline,
      dialog: false,
      uid: '',
      userName: null,
      userId: null,
      description: null,
      favoritePlace: null,
      teamItems: jLeagueTeamList,
      selectedTeam: [],
      favoritePlayer: null,
      selectedPlayer: []
    }
  },
  methods: {
    ...mapActions('alertMessage', ['setUserEditErrorMessage']),
    isShowDialog() {
      this.dialog = !this.dialog
    },
    clear() {
      this.$refs.observer.reset()
      this.dialog = !this.dialog
    },
    async sendProfile() {
      const db = getFirestore(app)
      const userDocRef = doc(db, 'users', this.uid)
      const userData = {
        user_name: this.userName,
        user_id: this.userId,
        description: this.description,
        favorite_place: this.favoritePlace,
        favorite_team: this.selectedTeam,
        favorite_player: this.selectedPlayer,
        updated_at: serverTimestamp()
      }
      await updateDoc(userDocRef, userData).catch(() => {
        this.setUserEditErrorMessage('保存できませんでした')
      })
      this.clear()
      this.$emit('get-profile')
    }
    },
  }
</script>

<style scoped>
  .container-width {
    width: 95%;
  }
  .v-text-field--outlined >>> fieldset {
    border-color: #21BF73;
    background-color: #F9FCFB;
    border-radius: 0;
    box-shadow: 1px 1px 3px;
  }
  .color {
    color: rgb(33, 191, 115);
  }

  @media screen and (min-width: 800px) {
    .container-width {
      width: 40%;
    }
    .tab-style {
      font-size: 14px;
    }
  }
</style>