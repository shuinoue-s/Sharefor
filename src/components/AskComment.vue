<template>
  <div>
    <v-expand-transition>
      <AskCommentForm
        v-show="isShow"
        :askId="askId"
        @click-close="isShow = !isShow"
        @get-comment="getComments"
      />
    </v-expand-transition>

    <v-expand-transition>
      <v-btn
        v-show="!isShow"
        @click="isShow = !isShow"
        color="customLightGreen"
        class="font mt-2"
        style="color: #21BF73;"
        block
      >
        コメントする
      </v-btn>
    </v-expand-transition>

    <v-sheet
      v-for="comment in comments"
      :key="comment.comment_id"
      outlined
      color="customLightGreen"
      class="mx-auto mt-2"
      elevation="3"
    >
      <v-card
        class="rounded-0"
        outlined
        color="white"
      >
        <v-card-actions class="py-1">
            <v-avatar
              v-if="comment.userInfo.icon_path"
              class="my-0 ml-2 mr-2"
              size="30"
            >
              <img
                :src="comment.userInfo.icon_path"
                :alt="comment.userInfo.icon_name"
              >
            </v-avatar>
            <v-avatar
              v-if="!comment.userInfo.icon_path"
              class="my-0 ml-2 mr-2"
              size="30"
            >
              <v-icon
                size="40"
              >{{ mdiAccountCircle }}</v-icon>
            </v-avatar>

            <p class="card-text mb-0 mr-4">@{{ comment.userInfo.user_id }}</p>
            <p class="card-text mb-0 mr-4">{{ comment.userInfo.user_name}}</p>
            <p class="card-text mb-0">{{ comment.created_at }}</p>
        </v-card-actions>

        <v-divider class="mx-4"></v-divider>

        <p class="comment-style mx-4 mb-0 py-1">{{comment.comment}}</p>
      </v-card>
    </v-sheet>

  </div>
</template>

<script>
import { mdiAccountCircle } from '@mdi/js'
import AskCommentForm from './AskCommentForm'
import { arrayDateFormat, arrayAddUserInfo } from '@/modules/storeModifications'
import app from '@/firebase/firebase'
import { getFirestore, getDocs, query, where, collectionGroup, orderBy } from 'firebase/firestore'

export default {
  name: 'AskComment',
  components: {
    AskCommentForm
  },
  props: ['askId'],
  data() {
    return {
      mdiAccountCircle,
      comments: '',
      isShow: false
    }
  },
  created() {
    this.getComments()
  },
  methods: {
    async getComments() {
      const db = getFirestore(app)
      if(this.askId) {
        const commentsCollectionGroup = collectionGroup(db, 'comments')
        const q = query(commentsCollectionGroup, orderBy('created_at', 'desc'), where('ask_id', '==', this.askId))
        const querySnapshot = await getDocs(q)
        let commentList = querySnapshot.docs.map(doc => doc.data())
        commentList = arrayDateFormat(commentList)
        this.comments = await arrayAddUserInfo(commentList)
      }
    }
  },
}
</script>

<style>
  .comment-style{
    white-space: pre-wrap;
    font-size: 14px;
  }
  .card-text {
    color: rgba(0, 0, 0, 0.6);
    font-size: 13px;
  }
</style>