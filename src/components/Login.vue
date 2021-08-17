<template>
  <v-form v-model="valid">
    <v-container>
      <v-col
        cols="12"
        class="mb-4"
      >
        <h1 class="display-2 font-weight-bold mb-3">
          Login
        </h1>
      </v-col>

      <v-col
        cols="12"
        md="4"
      >
        <v-text-field
          v-model="username"
          :rules="usernameRules"
          label="Username"
          required
        />
      </v-col>

      <v-col
        cols="12"
        md="4"
      >
        <v-text-field
          v-model="password"
          type="password"
          :rules="passwordRules"
          label="Password"
          required
        />
      </v-col>

      <v-btn
        class="mx-3 mb-5"
        @click="login"
      >
        Login
      </v-btn>
    </v-container>
  </v-form>
</template>

<script>
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
</script>
