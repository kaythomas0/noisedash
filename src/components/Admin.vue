<template>
  <v-container>
    <v-col cols="12">
      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          Admin Dashboard
        </h1>
      </v-col>

      <v-simple-table>
        <thead>
          <tr>
            <th class="text-left">
              ID
            </th>
            <th class="text-left">
              Username
            </th>
            <th class="text-left">
              Is Admin
            </th>
            <th class="text-left">
              Delete User
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in users"
            :key="user.username"
          >
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>
              <v-switch
                v-model="user.isAdmin"
                :label="`${user.isAdmin ? 'True' : 'False'}`"
                @change="updateUser(user.id, user.isAdmin); snackbar = true"
              />
            </td>
            <td>
              <v-btn
                @click="deleteUser(user.id)"
              >
                Delete
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-simple-table>
      <v-snackbar
        v-model="snackbar"
        timeout="3000"
      >
        {{ updateText }}

        <template v-slot:action="{ attrs }">
          <v-btn
            text
            v-bind="attrs"
            @click="snackbar = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-col>
  </v-container>
</template>

<script>
export default {
  name: 'Admin',

  data: () => ({
    users: [],
    snackbar: false,
    updateText: ''
  }),
  created () {
    this.getUsers()
  },
  methods: {
    getUsers () {
      this.$http.get('https://localhost:3000/users')
        .then(response => {
          if (response.status === 200) {
            this.users = response.data.users
          }
        })
        .catch(function (error) {
          console.error(error.response)
        })
    },
    updateUser (id, isAdmin) {
      this.$http.patch('https://localhost:3000/users/'.concat(id), {
        isAdmin: isAdmin ? 1 : 0
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
      this.$http.delete('https://localhost:3000/users/'.concat(id))
        .then(response => {
          if (response.status === 200) {
            this.getUsers()
          }
        })
        .catch(function (error) {
          console.error(error.response)
        })
    }
  }
}
</script>
