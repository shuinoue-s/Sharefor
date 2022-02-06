<template>
  <div>
    <v-progress-circular
      indeterminate
      color="customGreen"
      class="position-center"
      size="50"
    ></v-progress-circular>
  </div>
</template>

<script>
import { getAuth, getRedirectResult } from "firebase/auth"
import { mapActions } from "vuex"

export default {
  name: 'Loading',
  props: ['user'],
  created() {
    this.setResult(this.user)
    this.$router.push({name: 'Home', params: {message: 'ログインしました'}})
  },
  methods: {
    ...mapActions('auth', ['setResult']),
    getSignInResult() {
      const auth = getAuth()
      getRedirectResult(auth).then(() => {
        this.$router.push({name: 'Home', params: {message: 'ログインしました'}})
      }).catch(() => {
        this.$router.push({name: 'Login', params: {message: 'ログインに失敗しました'}})
      })
    }
  },
}
</script>

<style scoped>
  .position-center {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 90%;
    transform: translate(-50%, -50%);
  }
</style>