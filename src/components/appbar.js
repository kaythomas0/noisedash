export default {
  name: 'AppBar',

  data: () => ({
    drawyer: false,
    isAdmin: false,
    loggedIn: false
  }),
  methods: {
    home () {
      this.$router.push('/')
    },
    account () {
      this.$router.push('/account')
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
    },
    getCurrentUser () {
      this.loggedIn = false
      this.drawyer = true
      this.$http.get('/users/current')
        .then(response => {
          if (response.status === 200) {
            this.loggedIn = true
            this.isAdmin = response.data.user.isAdmin
            this.$vuetify.theme.dark = response.data.user.darkMode
          }
        })
        .catch(() => {
          this.isAdmin = false
        })
    }
  }
}
