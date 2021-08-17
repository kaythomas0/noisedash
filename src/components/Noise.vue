<template>
  <v-container>
    <v-row class="text-center">
      <v-col>
        <h1 class="display-2 font-weight-bold mb-5">
          Noisedash
        </h1>
      </v-col>

      <v-col cols="12">
        <v-row justify="center">
          <v-btn
            :disabled="playDisabled || !isTimerValid"
            class="mx-3 mb-5"
            fab
            large
            color="primary"
            @click="play"
          >
            <v-icon>mdi-play</v-icon>
          </v-btn>

          <v-btn
            class="mx-3 mb-5"
            fab
            large
            color="secondary"
            @click="stop"
          >
            <v-icon>mdi-stop</v-icon>
          </v-btn>
        </v-row>
      </v-col>

      <v-col cols="12">
        <h2 class="headline font-weight-bold mb-5">
          Timer
        </h2>

        <v-row justify="center">
          <v-checkbox
            v-model="isTimerEnabled"
            :disabled="playDisabled"
            label="Timer"
            class="mx-3"
          />
        </v-row>

        <v-form
          v-model="isTimerValid"
        >
          <v-row justify="center">
            <v-text-field
              v-model="hours"
              type="number"
              label="Hours"
              class="mx-3"
              :disabled="playDisabled || !isTimerEnabled"
              :rules="[rules.gt(-1)]"
            />

            <v-text-field
              v-model="minutes"
              type="number"
              label="Minutes"
              class="mx-3"
              :disabled="playDisabled || !isTimerEnabled"
              :rules="[rules.lt(60), rules.gt(-1)]"
            />

            <v-text-field
              v-model="seconds"
              type="number"
              label="Seconds"
              class="mx-3"
              :disabled="playDisabled || !isTimerEnabled"
              :rules="[rules.lt(60), rules.gt(-1)]"
            />

            <v-text-field
              v-model="timeRemaining"
              class="mx-3"
              :value="timeRemaining"
              label="Seconds Remaining"
              filled
              readonly
              :disabled="!isTimerEnabled"
            />
          </v-row>
        </v-form>
      </v-col>

      <v-col cols="12">
        <h2 class="headline font-weight-bold mb-5">
          Noise Settings
        </h2>

        <v-row justify="center">
          <v-slider
            v-model="volume"
            label="Volume"
            thumb-label
            max="0"
            min="-30"
            class="mx-3"
            @change="updateVolume"
          />
          <div
            class="mx-3"
          >
            <p>{{ volume }}</p>
          </div>
        </v-row>

        <v-row justify="center">
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
            label="Filter"
            class="mx-3"
            @change="updateAudioChain"
          />
        </v-row>

        <v-row justify="center">
          <v-slider
            v-model="filterCutoff"
            :disabled="!isFilterEnabled || isLFOFilterCutoffEnabled"
            label="Cutoff"
            thumb-label
            max="20000"
            min="0"
            class="mx-3"
            @change="updateFilterCutoff"
          />
          <div
            class="mx-3"
          >
            <p>{{ filterCutoff }}</p>
          </div>
        </v-row>

        <v-row justify="center">
          <v-select
            v-model="filterType"
            :disabled="!isFilterEnabled"
            :items="filterTypeItems"
            label="Filter Type"
            class="mx-3"
            @change="updateFilterType"
          />
        </v-row>
      </v-col>

      <v-col cols="12">
        <v-row justify="center">
          <v-checkbox
            v-model="isLFOFilterCutoffEnabled"
            :disabled="!isFilterEnabled"
            label="Filter Cutoff LFO"
            class="mx-3"
            @change="updateAudioChain"
          />
        </v-row>

        <v-row justify="center">
          <v-slider
            v-model="lfoFilterCutoffFrequency"
            :disabled="!isLFOFilterCutoffEnabled || !isFilterEnabled"
            thumb-label
            label="Rate"
            max="10"
            min="0.1"
            step="0.1"
            class="mx-3"
            @change="updateLFOFilterCutoffFrequency"
          />
          <div
            class="mx-3"
          >
            <p>{{ lfoFilterCutoffFrequency }}</p>
          </div>
        </v-row>

        <v-row justify="center">
          <v-range-slider
            v-model="lfoFilterCutoffRange"
            :disabled="!isLFOFilterCutoffEnabled || !isFilterEnabled"
            label="Range"
            thumb-label
            :min="lfoFilterCutoffMin"
            :max="lfoFilterCutoffMax"
            class="mx-3"
            @change="updateLFOFilterCutoffRange"
          />
          <div
            class="mx-3"
          >
            <p>{{ lfoFilterCutoffRange }}</p>
          </div>
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
            class="mx-3"
            @change="updateAudioChain"
          />
        </v-row>

        <v-row justify="center">
          <v-slider
            v-model="tremoloFrequency"
            :disabled="!isTremoloEnabled"
            label="Rate"
            thumb-label
            max="1"
            min="0"
            step="0.1"
            ticks
            tick-size="4"
            class="mx-3"
            @change="updateTremoloFrequency"
          />
          <div
            class="mx-3"
          >
            <p>{{ tremoloFrequency }}</p>
          </div>
        </v-row>

        <v-row justify="center">
          <v-slider
            v-model="tremoloDepth"
            :disabled="!isTremoloEnabled"
            label="Depth"
            thumb-label
            max="1"
            min="0"
            step="0.1"
            ticks
            tick-size="4"
            class="mx-3"
            @change="updateTremoloDepth"
          />
          <div
            class="mx-3"
          >
            <p>{{ tremoloDepth }}</p>
          </div>
        </v-row>
      </v-col>

      <v-col cols="12">
        <h2 class="headline font-weight-bold mb-5">
          Samples
        </h2>

        <v-row
          v-for="(sample, index) in samples"
          :key="sample.name"
        >
          <v-container>
            <v-row
              justify="center"
            >
              <v-checkbox
                v-model="checkedSamples"
                :value="sample.id"
                :label="`${sample.name}`"
                class="mx-3"
              />
            </v-row>

            <v-row>
              <v-slider
                v-model="sample.volume"
                label="Volume"
                thumb-label
                max="0"
                min="-30"
                class="mx-3"
                @change="updateSampleVolume(sample.id, index)"
              />
              <div
                class="mx-3"
              >
                <p>{{ samples[index].volume }}</p>
              </div>
            </v-row>
          </v-container>
        </v-row>

        <v-dialog
          v-model="sampleDialog"
          max-width="600px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              class="mx-3 mb-5"
              v-on="on"
            >
              Upload Sample
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">Add a Sample</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <p><strong>WARNING:</strong> Uploaded samples are publicly accessible.</p>
                </v-row>
                <v-row>
                  <v-file-input
                    v-model="selectedSample"
                    accept="audio/*"
                    label="Upload a sample!"
                  />
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="sampleName"
                      label="Sample Name"
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
                @click="sampleDialog = false"
              >
                Close
              </v-btn>
              <v-btn
                text
                @click="uploadSample"
              >
                Upload
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>

      <v-col cols="12">
        <h2 class="headline font-weight-bold mb-5">
          Profiles
        </h2>

        <v-row justify="center">
          <v-select
            v-model="selectedProfile"
            :items="profileItems"
            return-object
            label="Profiles"
            class="mx-3 mb-5"
            @change="loadProfile"
          />
        </v-row>

        <v-btn
          class="mx-3"
          @click="deleteProfile"
        >
          Delete Profile
        </v-btn>

        <v-dialog
          v-model="profileDialog"
          max-width="600px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              class="mx-3"
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
    </v-row>
  </v-container>
</template>

<script src="./noise.js"></script>
