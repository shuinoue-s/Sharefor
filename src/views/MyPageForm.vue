<template>
  <div>
    <MessageAlert :message="userEditErrorMessage" type="error" />

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
            <form @submit.prevent="saveStorage">
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
                  name="vFileInput"
                  rules="image|size:5000"
                >
                  <v-file-input
                    ref="vFileInput"
                    v-model="changedIconPath"
                    :error-messages="errors"
                    hide-input
                    class="input-style"
                    @change="setIconName"
                  ></v-file-input>
                  <v-avatar
                    class="avatar-style mb-1"
                    size="55"
                    @click="handleClickAvatar"
                  >
                    <v-img
                      :src="previewImage"
                    ></v-img>
                  </v-avatar>
                </validation-provider>

                <v-divider class="mb-4"></v-divider>

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
                  rules="max:300"
                >
                  <v-textarea
                    v-model="description"
                    :counter="300"
                    :error-messages="errors"
                    label="自己紹介"
                    outlined
                    dense
                    color="customGreen"
                  ></v-textarea>
                </validation-provider>

                <validation-provider
                  v-slot="{ errors }"
                  name="favorite-place"
                  rules="max:50"
                >
                  <v-text-field
                    v-model="favoritePlace"
                    :error-messages="errors"
                    label="お気に入りの場所"
                    outlined
                    dense
                    color="customGreen"
                  ></v-text-field>
                </validation-provider>

                <validation-provider
                  v-slot="{ errors }"
                  name="favorite-team"
                  rules="max:50|maxlength:3"
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
                  rules="max:30|maxlength:3"
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
import MessageAlert from '@/components/MessageAlert'
import { required, max, image, size } from 'vee-validate/dist/rules'
import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'
import app from '../firebase/firebase'
import { getFirestore, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage'
import { mapActions, mapGetters } from 'vuex'

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
extend('image', {
  ...image,
  message: '画像を選択してください'
})
extend('size', {
  ...size,
  message: '{size}KB以内である必要があります'
})

export default {
  name: 'MyPageForm',
  components: {
    ValidationProvider,
    ValidationObserver,
    MessageAlert
  },
  data() {
    return {
      mdiContentSaveOutline,
      dialog: false,
      uid: '',
      userName: null,
      userId: null,
      orignIconPath: null,
      changedIconPath: null,
      originIconName: null,
      iconName: null,
      previewImage: null,
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
      this.changedIconPath = null
      this.iconName = null
      this.previewImage = null
      this.dialog = !this.dialog
    },
    saveStorage() {
      if(this.changedIconPath) {       
        const storage = getStorage(app)
        const iconRef = ref(storage, `users/${this.uid}/icon`)
        listAll(iconRef).then(({ items }) => {
          if(items.length) {
            const deleteRef = ref(storage, `users/${this.uid}/icon/${this.originIconName}`)
            deleteObject(deleteRef).then(() => {
              const storageRef = ref(storage, `users/${this.uid}/icon/${this.iconName}`)
              uploadBytes(storageRef, this.changedIconPath).then(() => {
                getDownloadURL(storageRef).then(url => {
                  this.sendProfile(url)
                })
              }).catch(() => {
                this.setUserEditErrorMessage('保存できませんでした')
              })
            }).catch(() => {
              this.setUserEditErrorMessage('保存できませんでした')
            })
          } else {
            const storageRef = ref(storage, `users/${this.uid}/icon/${this.iconName}`)
            uploadBytes(storageRef, this.changedIconPath).then(() => {
              getDownloadURL(storageRef).then(url => {
                this.sendProfile(url)
              })
            }).catch(() => {
              this.setUserEditErrorMessage('保存できませんでした')
            })
          }
        })
      } else {
        this.sendProfile()
      }
    },
    sendProfile(iconPath = this.orignIconPath) {
      const db = getFirestore(app)
      const userDocRef = doc(db, 'users', this.uid)
      const userData = {
        user_name: this.userName,
        user_id: this.userId,
        icon_path: iconPath,
        icon_name: this.iconName ? this.iconName : this.originIconName,
        description: this.description ? this.description : '',
        favorite_place: this.favoritePlace ? this.favoritePlace : '',
        favorite_team: this.selectedTeam ? this.selectedTeam : [],
        favorite_player: this.selectedPlayer ? this.selectedPlayer : [],
        updated_at: serverTimestamp()
      }
      updateDoc(userDocRef, userData).then(() => {
      }).catch(() => {
        const storage = getStorage(app)
        const iconRef = ref(storage, `users/${this.uid}/icon`)
        listAll(iconRef).then(({ items }) => {
          if(items.length) {
            const deleteRef = ref(storage, `users/${this.uid}/icon/${this.iconName}`)
            deleteObject(deleteRef).then(() => {
              this.setUserEditErrorMessage('保存できませんでした')
            }).catch(() => {
              this.setUserEditErrorMessage('保存できませんでした')
            })
          } else {
            this.setUserEditErrorMessage('保存できませんでした')
          }
        })
      })
      this.clear()
      this.$emit('get-profile')
    },
    handleClickAvatar() {
      this.$refs.vFileInput.$el.querySelector("input").click()
    },
    setIconName(image) {
      if(image) {
        this.iconName = image.name
        this.previewImage = URL.createObjectURL(image)
      } else {
        this.previewImage = null
        this.changedIconPath = null
      }
    }
    },
    computed: {
      ...mapGetters('alertMessage', ['userEditErrorMessage']),
    }
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
  .input-style {
    display: none;
  }
  .avatar-style:hover {
    cursor: pointer;
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