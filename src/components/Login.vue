<template>
  <v-container>
    <v-form v-model="valid">
      <v-text-field
        v-model="username"
        label="Username"
        required
      />

      <v-text-field
        v-model="password"
        label="Password"
        type="password"
        required
      />

      <v-btn
        class="mr-4"
        type="submit"
      >
        Submit
      </v-btn>
    </v-form>
  </v-container>
</template>
