<template>
  <v-container>
    <v-row>
      <v-col class="mb-5">
        <h1 class="display-2 font-weight-bold mb-3">
          Account
        </h1>
      </v-col>
    </v-row>

    <v-col cols="12">
      <v-row>
        ID: {{ currentUser.id }}
      </v-row>
      <v-row>
        Username: {{ currentUser.username }}
      </v-row>
      <v-row>
        Name: {{ currentUser.name }}
      </v-row>
    </v-col>

    <v-dialog
      v-model="changePasswordDialog"
      max-width="600px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="my-3"
          v-bind="attrs"
          v-on="on"
          @click="resetChangePasswordForm"
        >
          Change Password
        </v-btn>
      </template>
      <v-form
        ref="changePasswordForm"
        v-model="isPasswordValid"
      >
        <v-card>
          <v-card-title>
            <span class="text-h5">Change Password</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="password"
                    type="password"
                    :rules="[rules.required]"
                    label="Password"
                    required
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              text
              @click="changePasswordDialog = false"
            >
              Close
            </v-btn>
            <v-btn
              text
              :disabled="!isPasswordValid"
              @click="updatePassword"
            >
              Change Password
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <v-switch
      v-model="$vuetify.theme.dark"
      label="Dark Mode"
      @change="toggleDarkMode"
    />

    <v-snackbar
      v-model="snackbar"
      timeout="3000"
    >
      {{ snackbarText }}

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
  </v-container>
</template>

<script src="./account.js"></script>
