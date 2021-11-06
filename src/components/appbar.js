export default {
  name: 'AppBar',

  data: () => ({
    drawyer: false,
    isAdmin: false
  }),
  methods: {
    home () {
      this.$router.push('/')
    },
    admin () {
      this.$router.push('/admin')
    },
    logout () {
      this.$http.get('/logout')
        .then(response => {
          if (response.status === 200) {
            this.$router.push('/login')
          }
        })
        .catch((error) => {
          console.error(error.response)
        })
    },
    getCurrentUser () {
      this.drawyer = true
      this.$http.get('/users/current')
        .then(response => {
          if (response.status === 200) {
            this.isAdmin = response.data.user.isAdmin
            this.$vuetify.theme.dark = response.data.user.darkMode
          }
        })
        .catch((error) => {
          console.error(error.response)
          this.isAdmin = false
        })
    },
    toggleDarkMode () {
      this.$http.patch('/users/dark-mode', {
        darkMode: this.$vuetify.theme.dark
      })
        .catch((error) => {
          console.error(error.response)
        })
    }
  }
}
