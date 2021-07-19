<template>
  <v-app-bar
    app
    color="secondary"
    dark
    dense
  >
    <v-container fill-height>
      <v-switch
        v-model="$vuetify.theme.dark"
        inset
        label="Dark Mode"
      />
    </v-container>
  </v-app-bar>
</template>
