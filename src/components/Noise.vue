<template>
  <v-container>
    <v-row class="text-center">
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
    </v-row>
  </v-container>
</template>

<script>
  import { Noise, Transport } from "tone";

  export default {
    name: 'Noise',

    data: () => ({
      isDisabled: false
    }),
    created() {
      this.noise = new Noise({volume: -10, type: "brown"}).toDestination()
    },
    methods: {
      handleStart() {
        this.isDisabled = true
        Transport.scheduleOnce((time) => {
          this.noise.start(time).stop(time + 2)
        })
        Transport.start()
      },
      handleStop() {
        Transport.stop()
        this.isDisabled = false
      }
    },
  }
</script>
