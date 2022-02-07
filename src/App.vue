<template>
  <v-app>
    <app-header/>
      <v-main>
        <router-view/>
        <Form v-if="isAuthenticated" />
      </v-main>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import AppHeader from './components/AppHeader'
import Form from './views/Form'

export default {
  name: 'App',
  components: {
    AppHeader,
    Form
  },
  computed: {
    ...mapGetters('auth', ['isAuthenticated'])
  }
}
</script>
