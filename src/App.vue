<template>
  <v-app>
    <app-header/>
      <v-main>
        <router-view/>
        <Form/>
      </v-main>
  </v-app>
</template>

<script>
import AppHeader from './components/AppHeader'
import Form from './views/Form'

export default {
  
  name: 'App',

  data() {
    return {

    }
  },
  components: {
    AppHeader,
    Form

  }
}
</script>

<style>
</style>
