<template>
  <v-container>
    <v-row>
      <v-col class="mb-5">
        <h1 class="display-2 font-weight-bold mb-3">
          Admin Dashboard
        </h1>
      </v-col>
    </v-row>

    <v-dialog
      v-model="registerUserDialog"
      max-width="600px"
    >
      <template #activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          v-on="on"
          @click="resetRegisterUserForm"
        >
          Register User
        </v-btn>
      </template>
      <v-form
        ref="registerUserForm"
        v-model="isUserValid"
      >
        <v-card>
          <v-card-title>
            <span class="text-h5">Register User</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="name"
                    :rules="[rules.required]"
                    label="Name"
                    required
                  />
                  <v-text-field
                    v-model="username"
                    :rules="[rules.required]"
                    label="Username"
                    required
                  />
                  <v-text-field
                    v-model="password"
                    type="password"
                    :rules="[rules.required]"
                    label="Password"
                    required
                  />
                  <v-switch
                    v-model="isAdmin"
                    :label="`${isAdmin ? 'Admin' : 'Not Admin'}`"
                  />
                  <v-switch
                    v-model="canUpload"
                    :label="`${canUpload ? 'Can Upload Samples' : 'Cannot Upload Samples'}`"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              text
              @click="registerUserDialog = false"
            >
              Close
            </v-btn>
            <v-btn
              text
              :disabled="!isUserValid"
              @click="registerUser"
            >
              Register
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <v-divider
      class="my-7"
    />

    <v-col cols="12">
      <v-row
        v-for="user in users"
        :key="user.username"
      >
        <v-container>
          <v-row>
            ID: {{ user.id }}
          </v-row>
          <v-row>
            Username: {{ user.username }}
          </v-row>
          <v-row>
            Name: {{ user.name }}
          </v-row>
          <v-row>
            <v-switch
              v-model="user.isAdmin"
              :label="`${user.isAdmin ? 'Admin' : 'Not Admin'}`"
              :disabled="user.id === currentUser.id"
              @change="updateUserAdmin(user.id, user.isAdmin); snackbar = true"
            />
          </v-row>
          <v-row>
            <v-switch
              v-model="user.canUpload"
              :label="`${user.canUpload ? 'Can Upload Samples' : 'Cannot Upload Samples'}`"
              :disabled="user.id === currentUser.id"
              @change="updateUserUpload(user.id, user.canUpload); snackbar = true"
            />
          </v-row>
          <v-row>
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
    </v-col>
  </v-container>
</template>

<script src="./admin.js"></script>
