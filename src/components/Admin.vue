<template>
  <v-container>
    <v-row class="text-center">
      <v-col class="mb-5">
        <h1 class="display-2 font-weight-bold mb-3">
          Admin Dashboard
        </h1>
      </v-col>
    </v-row>

    <v-row class="text-center">
      <v-col class="mb-5">
        <h2 class="headline font-weight-bold">
          Users
        </h2>
      </v-col>
    </v-row>

    <v-col cols="12">
      <v-row
        v-for="user in users"
        :key="user.username"
      >
        <v-container>
          <v-row
            justify="center"
          >
            ID: {{ user.id }}
          </v-row>
          <v-row
            justify="center"
          >
            Username: {{ user.username }}
          </v-row>
          <v-row
            justify="center"
          >
            Name: {{ user.name }}
          </v-row>
          <v-row
            justify="center"
          >
            <v-switch
              v-model="user.isAdmin"
              :label="`${user.isAdmin ? 'Admin' : 'Not Admin'}`"
              :disabled="user.id === currentUser.id"
              @change="updateUserAdmin(user.id, user.isAdmin); snackbar = true"
            />
          </v-row>
          <v-row
            justify="center"
          >
            <v-switch
              v-model="user.canUpload"
              :label="`${user.canUpload ? 'Can Upload Samples' : 'Cannot Upload Samples'}`"
              :disabled="user.id === currentUser.id"
              @change="updateUserUpload(user.id, user.canUpload); snackbar = true"
            />
          </v-row>
          <v-row
            justify="center"
          >
            <v-btn
              :disabled="user.id === currentUser.id"
              @click="deleteUser(user.id)"
            >
              Delete
            </v-btn>
          </v-row>
          <v-divider
            class="mt-7"
          />
        </v-container>
      </v-row>

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

<script src="./admin.js"></script>
