import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import Axios from 'axios'

const instance = Axios.create({
  baseURL: 'https://localhost:3000',
  withCredentials: true
})

Vue.prototype.$http = instance

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
