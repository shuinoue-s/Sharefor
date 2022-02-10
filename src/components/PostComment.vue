<template>
  <div>
    <v-expand-transition>
      <PostCommentForm
        v-show="isShow"
        :postId="postId"
        @click-close="isShow = !isShow"
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
    >
      {{comment.comment}}
    </v-card>

  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import PostCommentForm from './PostCommentForm'

export default {
  name: 'PostComment',
  components: {
    PostCommentForm
  },
  props: ['postId'],
  data() {
    return {
      isShow: false
    }
  },
  created() {
      this.getComments({ uid: this.user.uid, postId: this.postId })
  },
  methods: {
    ...mapActions('comments', ['getComments'])
  },
  computed: {
    ...mapGetters('comments', ['comments']),
    ...mapGetters('auth', ['user']),
    watchPostIdAndUser() {
      return [this.postId, this.user]
    }
  },
  watch: {
    watchPostIdAndUser() {
      if(this.postId && this.user) {
        this.getComments({ uid: this.user.uid, postId: this.postId })
      }
    }
  },
}
</script>

<style>

</style>