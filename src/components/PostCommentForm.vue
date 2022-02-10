<template>
  <div>
    <v-sheet
      outlined
      color="customLightGreen"
      class="mx-auto mt-1 mb-16"
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
                  :disabled="invalid"
                  type="submit"
                  color="customGreen"
                  class="mb-5"
                >
                  送信
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
import pathInfo from '../modules/pathInfo'
import { ValidationObserver, ValidationProvider, setInteractionMode, extend } from 'vee-validate'
import { required, max } from 'vee-validate/dist/rules'
import { getFirestore, serverTimestamp, collection, doc, setDoc } from "firebase/firestore"
import app from '../firebase/firebase'
import { mapGetters } from 'vuex'

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
  name: 'PostCommentForm',
  components: {
    ValidationObserver,
    ValidationProvider
  },
  props: ['postId'],
  data() {
    return {
      comment: ''
    }
  },
  created() {
    this.db = getFirestore(app)
  },
  methods: {
    reset() {
      this.$refs.observer.reset()
    },
    clickClose() {
      this.$emit('click-close')
    },
    async sendComment() {
      const usersCollectionRef = collection(this.db, 'users', this.user.uid, 'posts', this.postId, 'comments')
      const commentsDocumentRef = doc(usersCollectionRef)
      const commentData = {
        comment_id: commentsDocumentRef.id,
        post_id: this.postId,
        comment: this.comment,
        created_at: serverTimestamp(),
        icon_name: pathInfo(this.user.photoURL).basename,
        icon_path: this.user.photoURL,
        uid: this.user.uid,
        user_name: this.user.displayName
      }
      await setDoc(commentsDocumentRef, commentData).catch(() => {
        // this.setAskErrorMessage('投稿に失敗しました')
        console.log('error')
      })
      this.clear()
      // this.getAsks()
    },
    clear() {
      this.$refs.observer.reset()
      this.$refs.form.reset()
    }
  },
  computed: {
    ...mapGetters('auth', ['user']),
  }
}
</script>

<style>

</style>