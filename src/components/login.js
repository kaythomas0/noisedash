export default {
  data: () => ({
    valid: false,
    username: '',
    password: '',
    usernameRules: [
      v => !!v || 'Username is required'
    ],
    passwordRules: [
      v => !!v || 'Password is required'
    ]
  }),
  methods: {
    login () {
      this.$http.post('/login/password', {
        username: this.username,
        password: this.password
      })
        .then(response => {
          if (response.status === 200) {
            this.$router.push('/')
          }
        })
        .catch((error) => {
          console.error(error.response)
        })
    }
  }
}
