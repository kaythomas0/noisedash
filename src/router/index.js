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
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/RegisterView.vue')
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/AdminView.vue')
  },
  {
    path: '/account',
    name: 'Account',
    component: () => import('../views/AccountView.vue')
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
      .catch(() => {
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
      .catch(() => {
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
      .catch(() => {
        next('/login')
      })
  } else if (to.name === 'Account') {
    instance.get('/auth')
      .then(response => {
        if (response.status === 200) {
          next()
        } else {
          next('/register')
        }
      })
      .catch(() => {
        next('/register')
      })
  } else {
    next()
  }
})

export default router
