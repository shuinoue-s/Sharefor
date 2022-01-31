<template>
  <div>
    <validation-observer
      ref="observer"
      v-slot="{ invalid }"
    >
      <form @submit.prevent="post()">
        <v-toolbar
          dark
          color="customGreen"
          dense
        >
          <v-btn
            icon
            dark
            @click="emitClose"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title class="custom-light-green mx-auto">POST</v-toolbar-title>
          <v-toolbar-items>
            <v-btn
              dark
              text
              type="submit"
              :disabled="invalid"
              @click="emitSend"
            >
              <v-icon>{{ mdiSend }}</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
      
        <validation-provider
          v-slot="{ errors }"
          rules="required|max:50"
          name="タイトル"
        >
          <v-text-field
          class="ma-4"
            v-model="title"
            color="customGreen"
            :counter="50"
            :error-messages="errors"
            clearable
            label="おすすめの場所はどこですか？"

          ></v-text-field>
        </validation-provider>

        <!-- 地図 -->
        <validation-provider
          v-slot="{ errors }"
          name="tizu"
          rules=""
        >
          <v-text-field
          class="mb-4 mx-4"
            v-model="geopoint"
            color="customGreen"
            :error-messages="errors"
            label="地図です"
          ></v-text-field>
        </validation-provider>

        <validation-provider
          v-slot="{ errors }"
          name="body"
          rules="required|max:300"
        >
          <v-textarea
            class="mb-4 mx-4"
            v-model="body"
            name="body"
            color="customGreen"
            :error-messages="errors"
            :counter="300"
            clearable
            label="おすすめの理由は？"
            placeholder="厳かな雰囲気がありとても気に入っています。よく行きます！"
            hint="おすすめの理由を投稿してみましょう！"
          ></v-textarea>
        </validation-provider>

        <validation-provider
          v-slot="{ errors, validate }"
          name="image"
          rules="required|image|size:5000"
        >
          <v-file-input
            class="mb-4 mx-4"
            v-model="filePath"
            @change="validate"
            :error-messages="errors"
            label="写真も一緒に投稿しましょう"
            prepend-icon="mdi-camera"
            color="customGreen"
            show-size
          ></v-file-input>
          <v-img
            max-height="300"
            max-width="400"
            contain
            :src="previewImage"
            class="mx-auto"
          >
          </v-img>
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
              :items="tags"
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
        class="mt-4 ml-4"
        >
          clear
        </v-btn>
      </form>
    </validation-observer>
  </div>
</template>

<script>
import { mdiSend } from '@mdi/js'
import app from '../firebase/firebase'
import { collection, getFirestore, addDoc, getDocs, serverTimestamp } from "firebase/firestore"
import '../validation/veeValidate';
import { ValidationObserver, ValidationProvider, setInteractionMode, extend } from 'vee-validate';
import { required, max, image, size } from 'vee-validate/dist/rules';

setInteractionMode('eager');

extend('image', {
  ...image,
  message: '画像を選択してください',
})

extend('max', {
  ...max,
  message: '{_field_}は{length}文字以内で入力してください',
})

extend('required', {
  ...required,
  message: '入力必須です',
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

export default {
  name: 'PostForm',
  components: {
    ValidationObserver,
    ValidationProvider
  },
  data() {
    return {
      mdiSend,
      title: '',
      geopoint: [21, 10],
      body: '',
      filePath: '',
      fileName: '',
      tags: [],
      selected: [],
      uid: '',
      name: '',
    }
  },
  created() {
    this.db = getFirestore(app)
  },
  methods: {
    emitClose() {
      this.$emit('receive-close')
    },
    emitSend() {
      this.$emit('receive-send')
    },
    async clear() {
      this.title = ''
      this.geopoint = [21, 10]
      this.body = ''
      this.filePath = ''
      this.fileName = ''
      this.selected = []
      await this.postButtonClicked === true
    },
    async post() {
      await addDoc(collection(this.db, "posts"), {
        title: this.title,
        body: this.body,
        geopoint: this.geopoint,
        file_path: URL.createObjectURL(this.filePath),
        file_name: this.fileName,
        tags: this.selected,
        icon_path: '',
        icon_name: '',
        uid: '',
        user_name: '',
        is_show: false,
        created_at: serverTimestamp()
      })
      this.clear()
      this.getPost()
    },
    async getPost() {
      const postsCol = collection(this.db, 'posts')
      const postSnapshot = await getDocs(postsCol)
      const postList = postSnapshot.docs.map(doc => doc.data())
      for(let i = 0; i < postList.length; i++) {
        postList[i].created_at = new Date(postList[i].created_at * 1000).toString().slice(16, 24)
      }
      this.posts = postList
    },
  },
  computed: {
    previewImage() {
      if (!this.filePath) return;
      return URL.createObjectURL(this.filePath);
    }
  },
}
</script>

<style scoped>
  .custom-light-green {
    color: #B0EACD;
  }
</style>