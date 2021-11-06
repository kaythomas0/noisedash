export default {
  name: 'Admin',

  data: () => ({
    currentUser: {},
    users: [],
    snackbar: false,
    updateText: '',
    addUserDialog: false,
    isUserValid: false,
    name: '',
    username: '',
    password: '',
    isAdmin: false,
    canUpload: false,
    rules: {
      required: v => !!v || 'Required'
    }
  }),
  created () {
    this.getCurrentUser()
    this.getUsers()
  },
  methods: {
    getUsers () {
      this.$http.get('/users')
        .then(response => {
          if (response.status === 200) {
            this.users = response.data.users
          }
        })
        .catch((error) => {
          console.error(error.response)
        })
    },
    getCurrentUser () {
      this.$http.get('/users/current')
        .then(response => {
          if (response.status === 200) {
            this.currentUser = response.data.user
          }
        })
        .catch((error) => {
          console.error(error.response)
        })
    },
    updateUserAdmin (id, isAdmin) {
      this.$http.patch('/users/admin/'.concat(id), {
        isAdmin: isAdmin
      })
        .then(response => {
          if (response.status === 200) {
            this.updateText = 'User updated'
          }
        })
        .catch(function (error) {
          console.error(error.response)
          this.updateText = 'Error updating user'
        })
    },
    updateUserUpload (id, canUpload) {
      this.$http.patch('/users/upload/'.concat(id), {
        canUpload: canUpload
      })
        .then(response => {
          if (response.status === 200) {
            this.updateText = 'User updated'
          }
        })
        .catch(function (error) {
          console.error(error.response)
          this.updateText = 'Error updating user'
        })
    },
    deleteUser (id) {
      this.$http.delete('/users/'.concat(id))
        .then(response => {
          if (response.status === 200) {
            this.getUsers()
          }
        })
        .catch((error) => {
          console.error(error.response)
        })
    },
    addUser () {
      this.$http.post('/users', {
        name: this.name,
        username: this.username,
        password: this.password,
        isAdmin: this.isAdmin,
        darkMode: 0,
        canUpload: this.canUpload
      })
        .then(response => {
          if (response.status === 200) {
            this.addUserDialog = false
            this.updateText = 'User Registered'
            this.snackbar = true
            this.getUsers()
          }
        })
        .catch((error) => {
          console.error(error.response)
        })
    }
  }
}
