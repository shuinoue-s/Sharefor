<template>
  <v-app>
    <app-header/>
      <v-main>
        <router-view/>
        <post-button/>
      </v-main>
  </v-app>
</template>

<script>
import AppHeader from './components/AppHeader'
import PostButton from './components/PostButton'

export default {
  
  name: 'App',

  data() {
    return {

    }
  },
  components: {
    AppHeader,
    PostButton

  }
}
</script>

<style  scoped>
</style>
