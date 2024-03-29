import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import VueHead from 'vue-head'
import veeValidate from './plugins/vee-validate'
import InstantSearch from 'vue-instantsearch'

Vue.use(VueHead)
Vue.use(InstantSearch)

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  veeValidate,
  store,
  render: h => h(App)
}).$mount('#app')
