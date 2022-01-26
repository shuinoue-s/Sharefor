<template>
  <div>
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

        <v-card v-if="postButtonClicked">
          <validation-observer
            ref="observer"
            v-slot="{ invalid }"
          >
            <form @submit.prevent="submit">
          <v-toolbar
            dark
            color="customGreen"
            dense
          >
            <v-btn
              icon
              dark
              @click="checkClicked"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title class="custom-light-green mx-auto">POST</v-toolbar-title>
            <v-toolbar-items>
              <v-btn
                dark
                text
                @click="checkClicked"
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
                rules="required|max:50"
              >
                <v-text-field
                  v-model="title"
                  :counter="50"
                  :error-messages="errors"
                  label="おすすめの場所はどこですか？"

                ></v-text-field>
              </validation-provider>

              <!-- 地図 -->
              <validation-provider
                v-slot="{ errors }"
                name="tizu"
                rules="required"
              >
                <v-text-field
                  v-model="tizu"
                  :counter="7"
                  :error-messages="errors"
                  label="地図です"
                  required
                ></v-text-field>
              </validation-provider>

              <validation-provider
                v-slot="{ errors }"
                name="text"
                rules="required|max:300"
              >
                <v-textarea
                  name="text"
                  :error-messages="errors"
                  :counter="300"
                  label="おすすめの理由は？"
                  placeholder="厳かな雰囲気がありとても気に入っています。よく行きます！"
                  hint="おすすめの理由を投稿してみましょう！"
                  v-model="text"
                  required
                ></v-textarea>
              </validation-provider>

              <validation-provider
                v-slot="{ errors }"
                name="image"
                rules="required"
              >
                <v-file-input
                  :error-messages="errors"
                  label="写真も一緒に投稿しましょう"
                  prepend-icon="mdi-camera"
                  show-size
                  v-model="image"
                  required
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
                name="tags"
                rules="required"
              >
                <v-text-field
                  required
                  v-model="inputTags"
                  :counter="20"
                  :error-messages="errors"
                  label="タグを入力してください"
                  hint="複数入力する場合はスペースで区切ってください"
                  @change="addTag(inputTags)"
                ></v-text-field>
                
                <v-chip
                :error-messages="errors"
                  class="ma-2"
                  color="customPink"
                  text-color="white"
                  v-for="(tag) in tags"
                  :key="tag"
                  @click="selectedTag(tag)"
                >
                  {{ tag }}
                </v-chip>
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
        </v-card>

        <v-card v-if="recruitmentButtonClicked">
           <validation-observer
            ref="observer"
            v-slot="{ invalid }"
          >
            <form @submit.prevent="submit">
          <v-toolbar
            dark
            color="customGreen"
            dense
          >
            <v-btn
              icon
              dark
              @click="checkClicked"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title class="custom-light-green mx-auto">POST</v-toolbar-title>
            <v-toolbar-items>
              <v-btn
                dark
                text
                @click="checkClicked"
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
                  :items="stadiums.j1"
                  :error-messages="errors"
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
                  name="text"
                  :error-messages="errors"
                  :counter="300"
                  label="どんな場所が知りたいですか？"
                  placeholder="カシマスタジアム周辺で居心地のいいカフェを探しています。おすすめがあれば教えてください！"
                  hint="おすすめの場所を聞いてみましょう"
                  v-model="text2"
                  required
                  clearable
                ></v-textarea>
              </validation-provider>

              <validation-provider
                v-slot="{ errors }"
                name="tags"
                rules="required"
              >
                <v-text-field
                  required
                  v-model="inputTags"
                  :counter="20"
                  :error-messages="errors"
                  label="タグを入力してください"
                  hint="複数入力する場合はスペースで区切ってください"
                  @change="addTag(inputTags)"
                  clearable
                ></v-text-field>
                
                <v-chip
                :error-messages="errors"
                  class="ma-2"
                  color="customPink"
                  text-color="white"
                  v-for="(tag) in tags"
                  :key="tag"
                  @click="selectedTag(tag)"
                >
                  {{ tag }}
                </v-chip>
              </validation-provider>

              <validation-provider
                v-slot="{ errors }"
                name="image"
                rules="required"
              >
                <v-row justify="center"
                  :error-messages="errors"
                >
                  <v-date-picker
                    v-model="picker"
                    color="customGreen"
                    :min="now"
                    locale=”ja-jp”
                  ></v-date-picker>
                </v-row>
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
        </v-card>

      </v-dialog>
    </v-row>
    
  </div>
</template>

<script>
import { mdiSend } from '@mdi/js'
import { required, digits, email, max, regex } from 'vee-validate/dist/rules'
import { extend, ValidationObserver, ValidationProvider, setInteractionMode} from 'vee-validate'

setInteractionMode('eager')

extend('digits', {
  ...digits,
  message: '{_field_} needs to be {length} digits. ({_value_})',
})

extend('required', {
  ...required,
  message: '入力必須です',
})

extend('max', {
  ...max,
  message: '{_field_} may not be greater than {length} characters',
})

extend('regex', {
  ...regex,
  message: '{_field_} {_value_} does not match {regex}',
})

extend('email', {
  ...email,
  message: 'Email must be valid',
})

export default {
  data() {
    return {
        mdiSend,
        dialog: false,
        notifications: false,
        sound: true,
        widgets: false,
        postButtonClicked: false,
        recruitmentButtonClicked: false,
        title: '',
        tizu: '',
        text: '',
        image: '',
        select: null,
        inputTags: [],
        tags: [
          '神社',
          'カフェ',
          'よく行く',
          '大好き',
        ],
        stadiums: {
          j1: [
          '札幌ドーム',
          '県立カシマサッカースタジアム',
          '埼玉スタジアム２００２',
          '三協フロンテア柏スタジアム',
          '味の素スタジアム',
          '等々力陸上競技場',
          '日産スタジアム',
          'レモンガススタジアム平塚',
          'ＩＡＩスタジアム日本平',
          'ヤマハスタジアム（磐田）',
          '豊田スタジアム',
          'サンガスタジアム　ｂｙ　ＫＹＯＣＥＲＡ',
          'パナソニック スタジアム 吹田',
          'ヤンマースタジアム長居',
          'ヨドコウ桜スタジアム',
          'ノエビアスタジアム神戸',
          'エディオンスタジアム広島',
          'ベスト電器スタジアム',
          '駅前不動産スタジアム'

        ]
        },
        text2: '',
        picker: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        now: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)
        // new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000))
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
    selectedTag(tag) {
      this.inputTags.push(tag)
    },
    addTag(tag){
      if(!(tag === null || tag === '' || tag === undefined)) {
        this.tags.push(tag)
      }
    },
    submit() {
      this.$refs.observer.validate()
    },
    clear() {
      this.title = ''
      this.tizu = ''
      this.text = ''
      this.image = ''
      this.$refs.observer.reset()
    }
  },
  computed: {
    previewImage() {
      if (!this.image) return;
      return URL.createObjectURL(this.image);
    }
  },
  components: {
    ValidationProvider,
    ValidationObserver,
  },
}
</script>

<style>
.custom-light-green {
  color: #B0EACD;
}
</style>