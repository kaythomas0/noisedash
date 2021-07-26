import Vue from 'vue'
import Axios from 'axios'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

const instance = Axios.create({
  baseURL: 'https://localhost:3000',
  withCredentials: true
})

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Signin',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Signin.vue')
  },
  {
    path: '/register',
    name: 'Signup',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Signup.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.name === 'Home') {
    instance.get('/auth')
      .then(response => {
        if (response.status === 200) {
          next()
        } else {
          next('/login')
        }
      })
      .catch(function (error) {
        console.error(error.response)
        next('/login')
      })
  } else {
    next()
  }
})

export default router
