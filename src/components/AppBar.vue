<template>
  <v-container>
    <v-app-bar
      app
      color="secondary"
      dark
      dense
    >
      <v-app-bar-nav-icon
        @click="drawyer = true"
      />
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawyer"
      absolute
      temporary
    >
      <v-list
        nav
      >
        <v-list-item-group
          v-model="group"
        >
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              Home
            </v-list-item-title>
          </v-list-item>
          <v-list-item
            @click="logout"
          >
            <v-list-item-icon>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              Logout
            </v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-switch
              v-model="$vuetify.theme.dark"
              inset
              label="Dark Mode"
            />
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </v-container>
</template>

<script>
export default {
  name: 'AppBar',

  data: () => ({
    drawyer: false,
    group: null
  }),
  methods: {
    logout () {
      this.$http.get('https://localhost:3000/logout')
        .then(response => {
          if (response.status === 200) {
            this.$router.push('/login')
          }
        })
        .catch(function (error) {
          console.error(error.response)
        })
    }
  }
}
</script>
