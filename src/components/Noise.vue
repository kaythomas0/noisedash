<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-img
          :src="require('../assets/logo.svg')"
          class="my-3"
          contain
          height="200"
        />
      </v-col>

      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          Welcome to Noisedash
        </h1>
      </v-col>

      <v-col cols="12">
        <v-btn
          :disabled="isDisabled"
          @click="handleStart"
        >
          Start
        </v-btn>
      </v-col>

      <v-col cols="12">
        <v-btn
          @click="handleStop"
        >
          Stop
        </v-btn>
      </v-col>

      <v-col cols="12">
        <v-text-field
          v-model="seconds"
          label="Seconds"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { Noise, Transport } from "tone";

  export default {
    name: 'Noise',

    data: () => ({
      isDisabled: false,
      seconds: 4
    }),
    created() {
    },
    methods: {
      handleStart() {
        this.isDisabled = true
        Transport.cancel()
        this.noise = new Noise({volume: -10, type: "brown"}).toDestination()
        this.noise.sync().start(0).stop(this.seconds)
        Transport.start()
        Transport.loopEnd = this.seconds
      },
      handleStop() {
        Transport.stop()
        this.isDisabled = false
      }
    },
  }
</script>
