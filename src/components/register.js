export default {
  data: () => ({
    valid: false,
    name: '',
    username: '',
    password: '',
    rules: {
      required: v => !!v || 'Required'
    }
  }),
  methods: {
    register () {
      this.$http.post('/users', {
        name: this.name,
        username: this.username,
        password: this.password,
        isAdmin: 1,
        darkMode: 0,
        canUpload: 1
      })
        .then(response => {
          if (response.status === 200) {
            this.$router.push('/login')
          }
        })
    }
  }
}
