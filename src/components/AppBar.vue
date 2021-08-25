<template>
  <v-container>
    <v-app-bar
      app
      color="primary"
      dark
      dense
    >
      <v-app-bar-nav-icon
        @click="openDrawyer"
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
        <v-list-item-group>
          <v-list-item
            @click="home"
          >
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              Home
            </v-list-item-title>
          </v-list-item>
          <v-list-item
            v-if="isAdmin"
            @click="admin"
          >
            <v-list-item-icon>
              <v-icon>mdi-database-cog</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              Admin
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
    isAdmin: false
  }),
  methods: {
    home () {
      this.$router.push('/')
    },
    admin () {
      this.$router.push('/admin')
    },
    logout () {
      this.$http.get('/logout')
        .then(response => {
          if (response.status === 200) {
            this.$router.push('/login')
          }
        })
        .catch((error) => {
          console.error(error.response)
        })
    },
    openDrawyer () {
      this.$http.get('/users/current')
        .then(response => {
          if (response.data.user.isAdmin) {
            this.isAdmin = true
          } else {
            this.isAdmin = false
          }
        })
        .catch(function (error) {
          console.error(error.response)
          this.isAdmin = false
        })
      this.drawyer = true
    }
  }
}
</script>
