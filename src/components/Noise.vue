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
        <h2 class="headline font-weight-bold mb-5">
          Playback
        </h2>

        <v-row justify="center">
          <v-btn
            :disabled="startDisabled"
            class="mx-3"
            @click="handleStart"
          >
            Start
          </v-btn>

          <v-btn
            class="mx-3"
            @click="stopTransport"
          >
            Stop
          </v-btn>

          <v-text-field
            v-model="timeRemaining"
            class="mx-3"
            :value="timeRemaining"
            label="Time Remaining"
            filled
            readonly
          />
        </v-row>
      </v-col>

      <v-col cols="12">
        <h2 class="headline font-weight-bold mb-5">
          Noise Settings
        </h2>

        <v-row justify="center">
          <v-text-field
            v-model="noiseVolume"
            label="Volume"
            class="mx-3"
          />

          <v-text-field
            v-model="noiseDuration"
            label="Seconds"
            class="mx-3"
          />

          <v-select
            v-model="noiseColor"
            :items="noiseColorOptions"
            label="Noise Color"
            class="mx-3"
          />
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { Noise, Transport } from "tone";

  export default {
    name: "Noise",

    data: () => ({
      startDisabled: false,
      noiseDuration: 4,
      timeRemaining: 0,
      noiseColorOptions: ["pink", "white", "brown"],
      noiseColor: "pink",
      noiseVolume: -10
    }),
    created() {
      this.noise = new Noise()
    },
    methods: {
      handleStart() {
        this.startDisabled = true
        Transport.cancel()
        this.noise = new Noise({volume: this.noiseVolume, type: this.noiseColor}).toDestination()
        this.noise.sync().start(0).stop(this.noiseDuration)
        Transport.start()
        Transport.loopEnd = this.noiseDuration
        this.transportInterval = setInterval(() => this.stopTransport(), this.noiseDuration * 1000 + 100)

        this.timeRemaining = this.noiseDuration
        this.timeRemainingInterval = setInterval(() => this.timer(), 1000)
      },
      stopTransport() {
        clearInterval(this.transportInterval)
        Transport.stop()
        this.startDisabled = false

        clearInterval(this.timeRemainingInterval)
        this.timeRemaining = 0
      },
      timer() {
        this.timeRemaining -= 1
      }
    },
  }
</script>
