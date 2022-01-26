<template>
  <v-app>
    <app-header/>
      <v-main>
        <router-view/>
        <post-form/>
      </v-main>
  </v-app>
</template>

<script>
import AppHeader from './components/AppHeader'
import PostForm from './views/PostForm'

export default {
  
  name: 'App',

  data() {
    return {

    }
  },
  components: {
    AppHeader,
    PostForm

  }
}
</script>

<style  scoped>
</style>
