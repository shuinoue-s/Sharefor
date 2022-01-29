<template>
  <div>
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
                @click="checkClicked(); post()"
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
  </div>
</template>

<script>
import '../validation/veeValidate'
import { ValidationObserver, ValidationProvider } from 'vee-validate'

export default {
  name: 'RecruitmentForm',
  components: {
    ValidationObserver,
    ValidationProvider
  }
}
</script>

<style>

</style>