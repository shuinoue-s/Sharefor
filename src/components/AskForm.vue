<template>
  <div>
    <validation-observer
      ref="observer"
      v-slot="{ invalid }"
    >
      <v-form
      ref="form"
        @submit.prevent="sendAsk()"
      >
        <v-toolbar
          dark
          color="customGreen"
          dense
        >
          <v-btn
            icon
            dark
            @click="clickClose"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title class="font mx-auto" style="color: #B0EACD;">ASK</v-toolbar-title>
          <v-toolbar-items>
            <v-btn
              dark
              text
              @click="emitSend"
              type="submit"
              :disabled="invalid"
            >
              <v-icon>{{ mdiSend }}</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
    
        <validation-provider
          v-slot="{ errors }"
          name="title"
          rules="required"
        >
          <v-select
            class="mb-4 mx-4"
            id="title"
            v-model="selectedStadium"
            :items="stadiums.j1"
            :error-messages="errors"
            color="customGreen"
            item-color="customGreen"
            label="スタジアムを選択してください"
            chips
            clearable
          ></v-select>
        </validation-provider>

        <validation-provider
          v-slot="{ errors }"
          name="text"
          rules="required|max:300"
        >
          <v-textarea
            class="mb-4 mx-4"
            name="text"
            :error-messages="errors"
            :counter="300"
            color="customGreen"
            label="どんな場所が知りたいですか？"
            placeholder="カシマスタジアム周辺の居心地のいいカフェを探しています。おすすめの場所を教えてください！"
            hint="おすすめの場所を聞いてみましょう"
            v-model="text"
            required
            clearable
          ></v-textarea>
        </validation-provider>

        <validation-provider
          v-slot="{ errors }"
          rules="required|max:20|maxlength:10"
          name="タグ"
        >
          <v-combobox
            class="mb-4 mx-4"
            :error-messages="errors"
            :counter="10"
            v-model="selected"
            :items="askTags"
            label="タグを入力してください"
            color="customGreen"
            item-color="customGreen"
            multiple
            chips
            deletable-chips
            clearable
          >
          </v-combobox>
        </validation-provider>

        <v-spacer></v-spacer>
        <v-btn 
        @click="clear"
        class="font ma-4"
        >
          clear
        </v-btn>
      </v-form>
    </validation-observer>
  </div>
</template>

<script>
import { mdiSend } from '@mdi/js'
import pathInfo from '../modules/pathInfo'
import jLeagueTeamList from '../jLeagueTeamList'
import { ValidationObserver, ValidationProvider, setInteractionMode, extend } from 'vee-validate'
import { required, max } from 'vee-validate/dist/rules'
import { getFirestore, serverTimestamp, collection, setDoc, doc } from "firebase/firestore"
import app from '../firebase/firebase'
import { mapGetters, mapActions } from 'vuex'

setInteractionMode('eager')

extend('max', {
  ...max,
  message: '{_field_}は{length}文字以内で入力してください',
})

extend('required', {
  ...required,
  message: '入力必須です',
})

extend('maxlength', {
  validate: (select, {max}) => {
    return select.length <= max
  },
  params: ['max'],
  message: '最大{max}個まで入力可能です'
})

export default {
  name: 'AskForm',
  components: {
    ValidationObserver,
    ValidationProvider
  },
  data() {
    return {
      mdiSend,
      stadiums: jLeagueTeamList,
      selectedStadium: '',
      text: '',
      selected: [],
      // picker: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)
      // // new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000))
    }
  },
    created() {
    this.db = getFirestore(app)
  },
  methods: {
    ...mapActions('alertMessage', ['setAskErrorMessage']),
    ...mapActions('asks', ['getAsks']),
    clickClose() {
      this.emitClose()
      this.clear()
    },
    emitClose() {
      this.$emit('recieve-close')
    },
    emitSend() {
      this.$emit('recieve-send')
    },
    clear() {
      this.$refs.observer.reset()
      this.$refs.form.reset()
    },
    async sendAsk() {
      const usersCollectionRef = collection(this.db, 'users', this.user.uid, 'asks')
      const asksDocumentRef = doc(usersCollectionRef)
      const askData = {
        ask_id: asksDocumentRef.id,
        stadium: this.selectedStadium,
        text: this.text,
        tags: this.selected,
        icon_name: pathInfo(this.user.photoURL).basename,
        icon_path: this.user.photoURL,
        uid: this.user.uid,
        user_name: this.user.displayName,
        is_asking: true,
        created_at: serverTimestamp()
      }
      await setDoc(asksDocumentRef, askData).catch(() => {
        this.setAskErrorMessage('投稿に失敗しました')
      })
      this.clear()
      this.getAsks()
    }
  },
  computed: {
    ...mapGetters('auth', ['user']),
    ...mapGetters('asks', ['askTags'])
  }
}
</script>

<style scoped>
  @import '../css/style.css';
</style>