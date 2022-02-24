<template>
  <div>
    <v-row justify="center">
      <v-dialog
        v-model="dialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <v-card v-show="isLoading">
          <v-progress-circular
            indeterminate
            color="customGreen"
            class="position-center"
            size="40"
          ></v-progress-circular>
          <v-toolbar
            dark
            color="customGreen"
            dense
          >
            <v-btn
              icon
              dark
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title class="font mx-auto" style="color: #B0EACD;">編集</v-toolbar-title>
            <v-toolbar-items>
              <v-btn
                dark
                text
                disabled
              >
                <v-icon>{{ mdiContentSaveOutline }}</v-icon>保存
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>
        </v-card>

        <v-card v-show="!isLoading">
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
                  @click="clear"
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

              <MessageAlert :message="userEditErrorMessage" type="error" />

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
                    v-if="previewImage"
                    class="avatar-style mb-1"
                    size="55"
                    @click="handleClickAvatar"
                  >
                    <v-img
                      :src="previewImage"
                    ></v-img>
                  </v-avatar>
                  <v-avatar
                    v-if="!previewImage"
                    class="my-0 mr-2"
                    size="50"
                  >
                    <v-icon
                      size="70"
                    >{{ mdiAccountCircle }}</v-icon>
                  </v-avatar>
                </validation-provider>

                <v-divider class="mb-4"></v-divider>

                <validation-provider
                  v-slot="{ errors }"
                  name="user-name"
                  rules="required|max:50"
                  mode="aggressive"
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
                  ref="userId"
                  v-slot="{ errors }"
                  name="user-id"
                  rules="required|max:15|unique:@origin-user-id,@user-id-list"
                  mode="aggressive"
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
                  name="origin-user-id"
                >
                  <input v-model="originUserId" v-show="false">
                </validation-provider>
                <validation-provider
                  name="user-id-list"
                >
                  <input v-model="userIdList" v-show="false">
                </validation-provider>

                <validation-provider
                  v-slot="{ errors }"
                  name="description"
                  rules="max:300"
                  mode="aggressive"
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
                  mode="aggressive"
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
                  mode="aggressive"
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
                  mode="aggressive"
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
import { mdiContentSaveOutline, mdiAccountCircle } from '@mdi/js'
import jLeagueTeamList from '@/jLeagueTeamList'
import MessageAlert from '@/components/MessageAlert'
import { required, max, image, size } from 'vee-validate/dist/rules'
import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'
import app from '../firebase/firebase'
import { getFirestore, doc, serverTimestamp, updateDoc, runTransaction, collectionGroup, query, getDocs } from 'firebase/firestore'
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
extend('image', {
  ...image,
  message: '画像を選択してください'
})
extend('size', {
  ...size,
  message: '{size}KB以内である必要があります'
})
extend('maxlength', {
  validate: (select, {max}) => {
    return select.length <= max
  },
  params: ['max'],
  message: '最大{max}個まで入力可能です'
})
extend('unique', {
  validate: async (userId, {originUserId, userIdList}) => {
    console.log(originUserId)
    console.log(userIdList)
    if(originUserId === userId) {
      return true
    } else {
      const result = userIdList.includes(userId)
      return !result
    }
  },
  params: ['originUserId', 'userIdList'],
  message: 'すでに使用されているユーザーIDです'
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
      mdiAccountCircle,
      mdiContentSaveOutline,
      dialog: false,
      message: '保存できませんでした',
      uid: '',
      userName: null,
      originUserId: null,
      userIdList: [],
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
  created() {
    this.errorStopLoading()
    this.stopLoading()
  },
  methods: {
    ...mapActions('alertMessage', ['setUserEditErrorMessage']),
    ...mapActions('loading', ['loading', 'stopLoading']),
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
    async getUserIds() {
      const db = getFirestore(app)
      const userIdCollectionGroup = collectionGroup(db, 'user_id')
      const q = query(userIdCollectionGroup)
      const querySnapshot = await getDocs(q)
      this.userIdList = querySnapshot.docs.map(doc => doc.id)
    },
    async sendProfile() {
      this.loading()
      const db = getFirestore(app)
      const userDocRef = doc(db, 'users', this.uid)
      const userData = {
        user_name: this.userName,
        description: this.description ? this.description : '',
        favorite_place: this.favoritePlace ? this.favoritePlace : '',
        favorite_team: this.selectedTeam ? this.selectedTeam : [],
        favorite_player: this.selectedPlayer ? this.selectedPlayer : [],
        updated_at: serverTimestamp()
      }
      //ユーザーIDに変更があった場合の処理
      if(this.userId && (this.userId !== this.originUserId)) {
        try {
          await runTransaction(db, async (transaction) => {
            const userDocRef = doc(db, 'users', this.uid, 'unique', 'user_id')
            const docSnap = await transaction.get(userDocRef)
            if (!docSnap.exists()) {
              throw this.message
            }
            transaction.update(userDocRef, {
              user_id: this.userId
            })
            const prevIndexRef = doc(db, 'index', 'users', 'user_id', docSnap.data()['user_id'])
            transaction.delete(prevIndexRef)
            const indexRef = doc(db, 'index', 'users', 'user_id', this.userId)
            transaction.set(indexRef, {
              user: this.uid
            })
          }).then(() => {
            //アイコン画像に変更があった場合の処理
            if(this.changedIconPath) {  
              this.saveStorage(userDocRef, userData)
            //アイコン画像に変更がなかった場合の処理
            } else {
              updateDoc(userDocRef, userData).then(() => {
                this.stopLoading()
                this.clear()
                this.$emit('get-profile')
              }).catch(() => { this.errorHundring() })
            }
          }).catch(() => { this.errorHundring() })
        } catch (message) {
          this.stopLoading()
          this.setUserEditErrorMessage(message)
        }
      //ユーザーIDに変更がなかった場合の処理
      } else {
        //アイコン画像に変更があった場合の処理
        if(this.changedIconPath) {  
          this.saveStorage(userDocRef, userData)
        } else {
          //アイコン画像に変更がなかった場合の処理
          updateDoc(userDocRef, userData).then(() => {
            this.stopLoading()
            this.clear()
            this.$emit('get-profile')
          }).catch(() => { this.errorHundring() })
        }
      }
    },
    saveStorage(userDocRef, userData) {     
      const storage = getStorage(app)
      const storageRef = ref(storage, `users/${this.uid}/icon/${this.iconName}`)
      const iconRef = ref(storage, `users/${this.uid}/icon`)
      listAll(iconRef).then(({ items }) => {
        if(items.length) {
          const deleteRef = ref(storage, `users/${this.uid}/icon/${this.originIconName}`)
          deleteObject(deleteRef).then(() => {
            uploadBytes(storageRef, this.changedIconPath).then(() => {
              getDownloadURL(storageRef).then(url => {
                userData.icon_path = url
                userData.icon_name = this.iconName
                userData.updated_at = serverTimestamp()
                updateDoc(userDocRef, userData).then(() => {
                  this.stopLoading()
                  this.clear()
                  this.$emit('get-profile')
                }).catch(() => { this.errorHundring() })
              }).catch(() => { this.errorHundring() })
            }).catch(() => { this.errorHundring() })
          }).catch(() => { this.errorHundring() })
        } else {
          uploadBytes(storageRef, this.changedIconPath).then(() => {
            getDownloadURL(storageRef).then(url => {
              userData.icon_path = url
              userData.icon_name = this.iconName
              userData.updated_at = serverTimestamp()
              updateDoc(userDocRef, userData).then(() => {
                this.stopLoading()
                this.clear()
                this.$emit('get-profile')
              }).catch(() => { this.errorHundring() })
            }).catch(() => { this.errorHundring() })
          }).catch(() => { this.errorHundring() })
        }
      }).catch(() => { this.errorHundring() })
    },
    errorHundring() {
      this.stopLoading()
      this.setUserEditErrorMessage(this.message)
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
    },
    errorStopLoading() {
      setTimeout(() => {
        this.stopLoading()
      }, 6000)
    }
  },
  computed: {
    ...mapGetters('alertMessage', ['userEditErrorMessage']),
    ...mapGetters('loading', ['isLoading']),
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
  .position-center {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 90%;
    transform: translate(-50%, -50%);
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