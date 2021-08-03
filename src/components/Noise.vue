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
          Profiles
        </h2>

        <v-select
          v-model="selectedProfile"
          :items="profileItems"
          label="Profiles"
          class="mx-3"
          @click="loadProfiles"
        />

        <v-dialog
          v-model="profileDialog"
          max-width="600px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
            >
              Save Profile
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">Profile Name</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="profileName"
                      label="Profile Name"
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
                @click="profileDialog = false"
              >
                Close
              </v-btn>
              <v-btn
                text
                @click="saveProfile"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>

      <v-col cols="12">
        <h2 class="headline font-weight-bold mb-5">
          Playback
        </h2>

        <v-row justify="center">
          <v-btn
            :disabled="playDisabled"
            class="mx-3 mb-5"
            @click="play"
          >
            Start
          </v-btn>

          <v-btn
            class="mx-3 mb-5"
            @click="stop"
          >
            Stop
          </v-btn>

          <v-checkbox
            v-model="isTimerEnabled"
            :disabled="playDisabled"
            label="Enable Timer"
            class="mx-3"
          />

          <v-text-field
            v-model="duration"
            label="Seconds"
            class="mx-3"
            :disabled="playDisabled || !isTimerEnabled"
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
            v-model="volume"
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
            :items="noiseColorItems"
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
            @change="updateAudioChain"
          />
        </v-row>
      </v-col>

      <v-col cols="12">
        <v-row justify="center">
          <v-select
            v-model="filterType"
            :disabled="!isFilterEnabled"
            :items="filterTypeItems"
            label="Filter Type"
            class="mx-3"
            @change="updateFilterType"
          />

          <v-slider
            v-model="filterCutoff"
            :disabled="!isFilterEnabled || isLFOFilterCutoffEnabled"
            label="Frequency Cutoff (Hz)"
            thumb-label="always"
            :thumb-size="40"
            max="20000"
            min="0"
            class="mx-3"
            @change="updateFilterCutoff"
          />

          <v-checkbox
            v-model="isLFOFilterCutoffEnabled"
            :disabled="!isFilterEnabled"
            label="Filter Cutoff LFO"
            class="mb-5"
            @change="updateAudioChain"
          />

          <v-slider
            v-model="lfoFilterCutoffFrequency"
            :disabled="!isLFOFilterCutoffEnabled || !isFilterEnabled"
            label="Frequency (Hz)"
            thumb-label="always"
            :thumb-size="40"
            max="10"
            min="0.1"
            step="0.1"
            class="mx-3"
            @change="updateLFOFilterCutoffFrequency"
          />

          <v-range-slider
            v-model="lfoFilterCutoffRange"
            :disabled="!isLFOFilterCutoffEnabled || !isFilterEnabled"
            label="Frequency Range (Hz)"
            thumb-label="always"
            :thumb-size="40"
            :min="lfoFilterCutoffMin"
            :max="lfoFilterCutoffMax"
            class="mx-3"
            @change="updateLFOFilterCutoffRange"
          />
        </v-row>
      </v-col>

      <v-col cols="12">
        <h2 class="headline font-weight-bold mb-5">
          Tremolo
        </h2>

        <v-row justify="center">
          <v-checkbox
            v-model="isTremoloEnabled"
            label="Enabled"
            class="mb-5"
            @change="updateAudioChain"
          />
        </v-row>
      </v-col>

      <v-col cols="12">
        <v-row justify="center">
          <v-slider
            v-model="tremoloFrequency"
            :disabled="!isTremoloEnabled"
            label="Frequency (0-1 Hz)"
            thumb-label="always"
            :thumb-size="40"
            max="1"
            min="0"
            step="0.1"
            ticks
            tick-size="4"
            class="mx-3"
            @change="updateTremoloFrequency"
          />

          <v-slider
            v-model="tremoloDepth"
            :disabled="!isTremoloEnabled"
            label="Depth (0-1 Hz)"
            thumb-label="always"
            :thumb-size="40"
            max="1"
            min="0"
            step="0.1"
            ticks
            tick-size="4"
            class="mx-3"
            @change="updateTremoloDepth"
          />
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script src="./noise.js"></script>
