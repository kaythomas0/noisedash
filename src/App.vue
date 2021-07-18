<template>
  <v-app>
    <v-main>
      <Noise />
    </v-main>
  </v-app>
</template>

<script>
import Noise from './components/Noise';

export default {
  name: 'App',

  components: {
    Noise,
  },

  data: () => ({
    //
  }),
};
</script>
