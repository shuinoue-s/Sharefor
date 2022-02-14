<template>
  <div>
    <v-sheet
      outlined
      color="customLightGreen"
      class="mx-auto mt-2 mb-2"
      elevation="3"
    >
      <v-card
        outlined
        color="white"
        class="rounded-0"
      >
      <div class="text-end">
        <v-icon
          size="30"
          @click="clickClose"
        >{{ 'mdi-chevron-up' }}</v-icon>
      </div>
        <validation-observer
          ref="observer"
          v-slot="{ invalid }"
        >
          <v-form
            ref="form"
            @submit.prevent="sendComment"
          >
            <validation-provider
              v-slot="{ errors }"
              rules="required|max:300"
              name="comment"
              mode="aggressive"
            >
              <v-card-actions
                class="align-end pt-0"
              >
                <v-textarea
                  v-model="comment"
                  class="my-0 mx-4 pt-0"
                  name="comment"
                  color="customGreen"
                  :error-messages="errors"
                  :counter="300"
                  clearable
                  @blur="reset"
                  label="コメント"
                ></v-textarea>

                <v-btn                  
                  type="submit"
                  color="customGreen"
                  style="color: #fff;"
                  class="mb-5"
                  :disabled="invalid"
                >
                  <v-icon
                    size="20"
                  >{{ mdiSend }}</v-icon>送信
                </v-btn>
              </v-card-actions>
            </validation-provider>
          </v-form>
        </validation-observer>
      </v-card>
    </v-sheet>
  </div>
</template>

<script>
import { mdiSend } from '@mdi/js'
import { ValidationObserver, ValidationProvider, setInteractionMode, extend } from 'vee-validate'
import { required, max } from 'vee-validate/dist/rules'
import { getFirestore, serverTimestamp, collection, doc, setDoc } from "firebase/firestore"
import app from '../firebase/firebase'
import { mapActions, mapGetters } from 'vuex'

setInteractionMode('eager')

extend('max', {
  ...max,
  message: '{_field_}は{length}文字以内で入力してください',
})

extend('required', {
  ...required,
  message: '入力必須です',
})

export default {
  name: 'AskCommentForm',
  components: {
    ValidationObserver,
    ValidationProvider
  },
  props: ['askId'],
  data() {
    return {
      mdiSend,
      comment: ''
    }
  },
  created() {
    this.reset() 
  },
  methods: {
    ...mapActions('alertMessage', ['setAskErrorMessage']),
    reset() {
      this.$refs.observer.reset()
    },
    clickClose() {
      this.$emit('click-close')
    },
    async sendComment() {
      const db = getFirestore(app)
      const usersCollectionRef = collection(db, 'users', this.user.uid, 'asks', this.askId, 'comments')
      const commentsDocumentRef = doc(usersCollectionRef)
      const commentData = {
        uid: this.user.uid,
        comment_id: commentsDocumentRef.id,
        ask_id: this.askId,
        comment: this.comment,
        created_at: serverTimestamp()
      }
      await setDoc(commentsDocumentRef, commentData).catch(() => {
        this.setAskErrorMessage('投稿に失敗しました')
      })
      this.clear()
      this.$emit('get-comment')
    },
    clear() {
      this.$refs.form.reset()
      this.$refs.observer.reset()
    }
  },
  computed: {
    ...mapGetters('auth', ['user']),
  }
}
</script>

<style>

</style>