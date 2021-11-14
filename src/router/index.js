import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/HomeView.vue'
import instance from '../axios'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/LoginView.vue')
  },
  {
    path: '/register',
    name: 'Register',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/RegisterView.vue')
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import(/* webpackChunkName: "about" */ '../views/AdminView.vue')
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
          next('/register')
        }
      })
      .catch((error) => {
        console.error(error.response)
        next('/register')
      })
  } else if (to.name === 'Admin') {
    instance.get('/admin')
      .then(response => {
        if (response.status === 200) {
          next()
        } else {
          next('/')
        }
      })
      .catch((error) => {
        console.error(error.response)
        next('/')
      })
  } else if (to.name === 'Register') {
    instance.get('/setup')
      .then(response => {
        if (response.status !== 200 || !response.data.setup) {
          next('/login')
        } else {
          next()
        }
      })
      .catch((error) => {
        console.error(error.response)
        next('/login')
      })
  } else {
    next()
  }
})

export default router
