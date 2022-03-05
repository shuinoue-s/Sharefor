<template>
  <v-app>
    <AppHeader />
      <v-main>
        <router-view/>
        <Form v-if="isAuthenticated" />
        <div style="height: 150px;"></div>
        <AppFooter />
      </v-main>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import AppHeader from './components/AppHeader'
import AppFooter from './components/AppFooter'
import Form from './views/Form'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter,
    Form
  },
  computed: {
    ...mapGetters('auth', ['isAuthenticated'])
  }
}
</script>
