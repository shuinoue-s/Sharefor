import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home'
import store from '../store/index'
// import goTo from 'vuetify/lib/services/goto'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    props: true,
    component: Home
  },
  {
    path: '/asking',
    name: 'Asking',
    component: () => import(/* webpackChunkName: "Asking" */ '../views/Asking.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    props: true,
    component: () => import(/* webpackChunkName: "Login" */ '../views/Login.vue'),
  },
  {
    path: '/post/:id',
    name: 'PostShow',
    props: true,
    component: () => import(/* webpackChunkName: "PostShow" */ '../views/PostShow.vue'),
  },
  {
    path: '/ask/:id',
    name: 'AskShow',
    props: true,
    component: () => import(/* webpackChunkName: "AskShow" */ '../views/AskShow.vue'),
  },
  {
    path: '/post/tag/:tag',
    name: 'TaggedPostList',
    component: () => import(/* webpackChunkName: "TaggedPostList" */ '../views/TaggedPostList.vue'),
  },
  {
    path: '/ask/tag/:tag',
    name: 'TaggedAskList',
    component: () => import(/* webpackChunkName: "TaggedAskList" */ '../views/TaggedAskList.vue'),
  },
  {
    path: '/mypage',
    name: 'MyPage',
    component: () => import(/* webpackChunkName: "MyPage" */ '../views/MyPage.vue'),
  },
  {
    path: '/*',
    name: 'NotFound',
    component: () => import(/* webpackChunkName: "NotFound" */ '../views/NotFound.vue'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  // scrollBehavior: (to, from, savedPosition) => {
  //   setTimeout(() => {
  //     let scrollTo = 0
  //     if (to.hash) {
  //       scrollTo = to.hash
  //     } else if (savedPosition) {
  //       scrollTo = savedPosition.y
  //     }
  //     return goTo(scrollTo)
  //   }, 300)
  // },
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated']
  if(to.name !== 'Login' && !isAuthenticated) next({name: 'Login'})
  else next()
})

export default router
