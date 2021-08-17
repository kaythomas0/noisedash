import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
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
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import(/* webpackChunkName: "about" */ '../views/AdminPage.vue')
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
      .catch((error) => {
        console.error(error.response)
        next('/login')
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
  } else {
    next()
  }
})

export default router
