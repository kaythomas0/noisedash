export default {
  name: 'AppBar',

  data: () => ({
    drawyer: false,
    isAdmin: false,
    loggedIn: false
  }),
  created () {
    this.getUserPreferences()
  },
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
    checkForAdmin () {
      this.loggedIn = false
      this.drawyer = true
      this.$http.get('/users/current')
        .then(response => {
          if (response.status === 200) {
            this.loggedIn = true
            this.isAdmin = response.data.user.isAdmin
          }
        })
        .catch(() => {
          this.isAdmin = false
        })
    },
    getUserPreferences () {
      this.$http.get('/users/current')
        .then(response => {
          if (response.status === 200) {
            const preferences = response.data.user.preferences
            this.$vuetify.theme.themes.dark.primary = preferences.accentColor
            this.$vuetify.theme.themes.light.primary = preferences.accentColor
          }
        })
    }
  }
}
