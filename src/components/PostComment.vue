<template>
  <div>
    <v-expand-transition>
      <PostCommentForm
        v-show="isShow"
        :postId="postId"
        @click-close="isShow = !isShow"
        @send-comment="getComments"
      />
    </v-expand-transition>

    <v-expand-transition>
      <v-btn
        v-show="!isShow"
        @click="isShow = !isShow"
        color="customLightGreen"
        class="font mt-1"
        style="color: #21BF73;"
        block
      >
        コメントする
      </v-btn>
    </v-expand-transition>

    <v-card
      v-for="comment in comments"
      :key="comment.comment_id"
      class="comment-style"
    >
      {{comment.comment}}
    </v-card>

  </div>
</template>

<script>
import PostCommentForm from './PostCommentForm'
import { arrayDateFormat } from '@/modules/storeModifications'
import app from '@/firebase/firebase'
import { getFirestore, getDocs, query, where, collectionGroup, orderBy } from 'firebase/firestore'

export default {
  name: 'PostComment',
  components: {
    PostCommentForm
  },
  props: ['postId'],
  data() {
    return {
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
      if(this.postId) {
        const commentsCollectionGroup = collectionGroup(db, 'comments')
        const q = query(commentsCollectionGroup, orderBy('created_at', 'desc'), where('post_id', '==', this.postId))
        const querySnapshot = await getDocs(q)
        let commentList = querySnapshot.docs.map(doc => doc.data())
        this.comments = arrayDateFormat(commentList)
      }
    }
  },
}
</script>

<style>
  .comment-style{
    white-space: pre-wrap;
  }
</style>