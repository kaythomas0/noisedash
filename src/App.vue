<template>
  <v-app>
    <AppBar />
    <v-main>
      <v-container fluid>
        <router-link to="/">
          Home
        </router-link> |
        <router-link to="/login">
          Login
        </router-link>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import AppBar from '@/components/AppBar'

export default {
  name: 'App',

  components: {
    AppBar,
  },

  data: () => ({
    //
  }),
}
</script>
