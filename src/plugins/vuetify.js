import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'
import '@mdi/font/css/materialdesignicons.css'
import { createSimpleTransition } from 'vuetify/lib/components/transitions/createTransition'

Vue.use(Vuetify)

const slideTransition = createSimpleTransition('v-slide-transition')
Vue.component('v-slide-transition', slideTransition)


export default new Vuetify({
    theme: {
        themes: {
            light: {
                customAlmostWhite: "#F9FCFB",
                customLightGreen: "#B0EACD",
                customGreen: "#21BF73",
                customPink: '#F881DD'
            }
        }
    },
    icons: {
        iconfont: 'mdiSvg'
      }
});
