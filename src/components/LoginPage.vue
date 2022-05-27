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
        :disabled="!valid"
        @click="login"
      >
        Login
      </v-btn>

      <v-snackbar
        v-model="snackbar"
        color="error"
        timeout="3000"
      >
        {{ snackbarText }}

        <template #action="{ attrs }">
          <v-btn
            text
            v-bind="attrs"
            @click="snackbar = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-container>
  </v-form>
</template>

<script src="./login.js"></script>
