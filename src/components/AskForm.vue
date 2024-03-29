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
              class="font"
              dark
              text
              @click="emitSend"
              type="submit"
              :disabled="invalid"
            >
              <v-icon>{{ mdiSend }}</v-icon>送信
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
            :items="stadiums"
            :error-messages="errors"
            color="customGreen"
            item-color="customGreen"
            label="スタジアムを選択してください"
            chips
            clearable
            item-text="name"
            item-value="name"
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
import jLeagueStadiumList from '@/jLeagueStadiumList'
import { ValidationObserver, ValidationProvider, setInteractionMode,  } from 'vee-validate'
import { getFirestore, serverTimestamp, collection, setDoc, doc } from "firebase/firestore"
import app from '../firebase/firebase'
import { mapGetters, mapActions } from 'vuex'

setInteractionMode('aggressive')

export default {
  name: 'AskForm',
  components: {
    ValidationObserver,
    ValidationProvider
  },
  data() {
    return {
      mdiSend,
      stadiums: jLeagueStadiumList,
      selectedStadium: null,
      text: null,
      selected: [],
      // picker: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)
      // // new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000))
    }
  },
  created() {
    this.firstGetAsks()
  },
  methods: {
    ...mapActions('alertMessage', ['setAskErrorMessage']),
    ...mapActions('asks', ['firstGetAsks']),
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
      this.resetForm()
      this.$refs.observer.reset()
    },
    resetForm() {
      if(this.selectedStadium) this.selectedStadium = null
      if(this.text) this.text = null
      if(this.selected) this.selected = []
    },
    async sendAsk() {
      const db = getFirestore(app)
      const usersCollectionRef = collection(db, 'users', this.user.uid, 'asks')
      const asksDocumentRef = doc(usersCollectionRef)
      const askData = {
        uid: this.user.uid,
        ask_id: asksDocumentRef.id,
        stadium: this.selectedStadium,
        text: this.text,
        tags: this.selected,
        is_asking: true,
        favo_count: 0,
        created_at: serverTimestamp()
      }
      await setDoc(asksDocumentRef, askData).catch(() => {
        this.setAskErrorMessage('投稿に失敗しました')
      })
      this.clear()
      this.$route.name !== 'Home' ? this.$router.push({name: 'Home', params: {setTab: 'ask-list'}}) : this.firstGetAsks()
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