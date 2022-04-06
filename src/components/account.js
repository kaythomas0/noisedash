export default {
  name: 'Admin',

  data: () => ({
    currentUser: {},
    changePasswordDialog: false,
    isPasswordValid: false,
    password: '',
    snackbar: false,
    snackbarText: '',
    rules: {
      required: v => !!v || 'Required'
    }
  }),
  created () {
    this.getCurrentUser()
  },
  methods: {
    getCurrentUser () {
      this.$http.get('/users/current')
        .then(response => {
          if (response.status === 200) {
            this.currentUser = response.data.user
          }
        })
    },
    updatePassword () {
      this.$http.patch('/users/password', {
        password: this.password
      })
        .then(response => {
          if (response.status === 200) {
            this.changePasswordDialog = false
            this.snackbarText = 'Password Changed'
            this.snackbar = true
          }
        })
    },
    resetChangePasswordForm () {
      if (this.$refs.changePasswordForm) {
        this.$refs.changePasswordForm.reset()
      }
    },
    toggleDarkMode () {
      this.$http.patch('/users/dark-mode', {
        darkMode: this.$vuetify.theme.dark
      })
    }
  }
}
