<template>
  <v-form v-model="valid">
    <v-container>
      <v-col
        cols="12"
        class="mb-4"
      >
        <h1 class="display-2 font-weight-bold mb-3">
          Register
        </h1>
      </v-col>

      <v-col
        cols="12"
        md="4"
      >
        <v-text-field
          v-model="name"
          :rules="[rules.required]"
          label="Name"
          required
        />
      </v-col>

      <v-col
        cols="12"
        md="4"
      >
        <v-text-field
          v-model="username"
          :rules="[rules.required]"
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
          :rules="[rules.required]"
          label="Password"
          required
        />
      </v-col>

      <v-btn
        class="mx-3 mb-5"
        @click="register"
      >
        Register
      </v-btn>
    </v-container>
  </v-form>
</template>

<script src="./register.js"></script>
