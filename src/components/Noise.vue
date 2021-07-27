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
            class="mx-3 mb-5"
            @click="playNoise"
          >
            Start
          </v-btn>

          <v-btn
            class="mx-3 mb-5"
            @click="stopTransport"
          >
            Stop
          </v-btn>

          <v-checkbox
            v-model="isTimerEnabled"
            :disabled="startDisabled"
            label="Enable Timer"
            class="mx-3"
          />

          <v-text-field
            v-model="noiseDuration"
            label="Seconds"
            class="mx-3"
            :disabled="startDisabled || !isTimerEnabled"
          />

          <v-text-field
            v-model="timeRemaining"
            class="mx-3"
            :value="timeRemaining"
            label="Time Remaining"
            filled
            readonly
            :disabled="!isTimerEnabled"
          />
        </v-row>
      </v-col>

      <v-col cols="12">
        <h2 class="headline font-weight-bold mb-5">
          Noise Settings
        </h2>

        <v-row justify="center">
          <v-slider
            v-model="noiseVolume"
            label="Volume"
            thumb-label="always"
            :thumb-size="40"
            max="0"
            min="-30"
            class="mx-3"
            @change="updateVolume"
          />

          <v-select
            v-model="noiseColor"
            :items="noiseColorOptions"
            label="Noise Color"
            class="mx-3"
            @change="updateNoiseColor"
          />
        </v-row>
      </v-col>

      <v-col cols="12">
        <h2 class="headline font-weight-bold mb-5">
          Filter
        </h2>

        <v-row justify="center">
          <v-checkbox
            v-model="isFilterEnabled"
            label="Enabled"
            class="mb-5"
            @change="updateFilter"
          />
        </v-row>
      </v-col>

      <v-col cols="12">
        <v-row justify="center">
          <v-select
            v-model="filterType"
            :items="filterTypeOptions"
            label="Filter Type"
            class="mx-3"
          />

          <v-slider
            v-model="frequencyCutoff"
            label="Frequency Cutoff (Hz)"
            thumb-label="always"
            :thumb-size="40"
            max="20000"
            min="0"
            class="mx-3"
          >
            <template v-slot:append>
              <v-text-field
                v-model="frequencyCutoff"
                class="mt-0 pt-0"
                type="number"
              />
            </template>
          </v-slider>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script src="./noise.js"></script>
