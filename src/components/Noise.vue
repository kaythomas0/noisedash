<template>
  <v-container>
    <v-row class="text-center">
      <v-col>
        <h1 class="display-2 font-weight-bold mb-5">
          Noisedash
        </h1>
      </v-col>

      <v-col cols="12">
        <h2 class="display-1 font-weight-bold mb-10">
          Playback
        </h2>

        <v-row justify="center">
          <v-btn
            :disabled="playDisabled || !isTimerValid"
            class="mx-3 mb-5"
            fab
            large
            color="primary"
            :loading="mainPlayLoading"
            @click="play"
          >
            <v-icon>mdi-play</v-icon>
          </v-btn>

          <v-btn
            class="mx-3 mb-5"
            fab
            large
            color="primary"
            @click="stop"
          >
            <v-icon>mdi-stop</v-icon>
          </v-btn>
        </v-row>
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
            :disabled="playDisabled"
            @change="loadProfile"
          />
        </v-row>

        <v-btn
          class="mx-3 my-3"
          :disabled="profileItems.length < 2 || playDisabled"
          @click="deleteProfile"
        >
          Delete Profile
        </v-btn>

        <v-btn
          class="mx-3 my-3"
          @click="updateProfile"
        >
          Save Profile
        </v-btn>

        <v-dialog
          v-model="profileDialog"
          max-width="600px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              class="mx-3 my-3"
              :disabled="playDisabled"
              v-on="on"
              @click="resetProfileForm"
            >
              Save Profile As...
            </v-btn>
          </template>
          <v-form
            ref="profileForm"
            v-model="isProfileValid"
          >
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
                        :rules="[rules.required()]"
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
                  :disabled="!isProfileValid"
                  @click="saveProfile"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-dialog>

        <v-dialog
          v-model="profileMoreDialog"
          max-width="600px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              class="mx-3 my-3"
              :disabled="playDisabled"
              v-on="on"
            >
              More...
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">More Profile Options</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-list-item-group>
                      <v-list-item
                        @click="openImportDialog"
                      >
                        <v-list-item-icon>
                          <v-icon>mdi-file-import</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>
                          Import Profile
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item
                        @click="openExportDialog"
                      >
                        <v-list-item-icon>
                          <v-icon>mdi-file-export</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>
                          Export Profile
                        </v-list-item-title>
                      </v-list-item>
                    </v-list-item-group>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                text
                @click="profileMoreDialog = false"
              >
                Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog
          v-model="importDialog"
          max-width="600px"
        >
          <v-form
            ref="importForm"
            v-model="isImportValid"
          >
            <v-card>
              <v-card-title>
                <span class="text-h5">Import Profile</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-file-input
                      v-model="importedProfile"
                      accept=".json"
                      label="Upload a profile file!"
                      :rules="[rules.required()]"
                    />
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  text
                  @click="importDialog = false"
                >
                  Close
                </v-btn>
                <v-btn
                  text
                  :disabled="!isImportValid"
                  @click="importProfile"
                >
                  Import
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-dialog>

        <v-dialog
          v-model="exportDialog"
          max-width="600px"
        >
          <v-card>
            <v-card-title>
              <span class="text-h5">Export Profile</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-select
                    v-model="exportedProfile"
                    :items="profileItems"
                    return-object
                    label="Profiles"
                    class="mx-3 mb-5"
                  />
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                text
                @click="exportDialog = false"
              >
                Close
              </v-btn>
              <v-btn
                text
                @click="exportProfile"
              >
                Export
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
        <h2 class="display-1 font-weight-bold mb-5">
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
            @input="updateVolume"
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
            @input="updateFilterCutoff"
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
            min="0"
            step="0.01"
            class="mx-3"
            @input="updateLFOFilterCutoffFrequency"
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
            @input="updateLFOFilterCutoffRange"
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
            step="0.01"
            class="mx-3"
            @input="updateTremoloFrequency"
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
            @input="updateTremoloDepth"
          />
          <div
            class="mx-3"
          >
            <p>{{ tremoloDepth }}</p>
          </div>
        </v-row>
      </v-col>

      <v-col
        v-if="canUpload"
        cols="12"
      >
        <h2 class="display-1 font-weight-bold mb-5">
          Samples
        </h2>

        <v-row
          v-for="(sample, index) in loadedSamples"
          :key="sample.name"
        >
          <v-container>
            <v-row
              justify="center"
            >
              {{ sample.name }}
            </v-row>

            <v-row>
              <v-btn
                icon
                :disabled="playDisabled"
                @click="removeSample(index)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>

              <v-slider
                v-model="sample.volume"
                label="Volume"
                thumb-label
                max="0"
                min="-30"
                class="mx-3"
                @input="updateSampleVolume(sample.id, index)"
              />
              <div
                class="mx-3"
              >
                <p>{{ loadedSamples[index].volume }}</p>
              </div>
            </v-row>
          </v-container>
        </v-row>

        <v-dialog
          v-model="addSampleDialog"
          max-width="600px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              class="mx-3 my-3 mb-5"
              :disabled="playDisabled"
              v-on="on"
            >
              Add Sample
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">Add Sample</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row v-if="unloadedSamples.length != 0">
                  <v-list-item
                    v-for="(sample) in unloadedSamples"
                    :key="sample.name"
                  >
                    <v-list-item-action>
                      <v-checkbox
                        v-model="checkedSamples"
                        :value="sample.id"
                      />
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>{{ sample.name }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-row>
                <v-row v-else>
                  No samples to add
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                text
                @click="addSampleDialog = false"
              >
                Close
              </v-btn>
              <v-btn
                text
                :disabled="unloadedSamples.length === 0"
                @click="addSample"
              >
                Add
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog
          v-model="uploadSampleDialog"
          max-width="600px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              class="mx-3 my-3 mb-5"
              v-on="on"
              @click="resetUploadSampleForm"
            >
              Upload Sample
            </v-btn>
          </template>
          <v-form
            ref="uploadSampleForm"
            v-model="isSampleUploadValid"
          >
            <v-card>
              <v-card-title>
                <span class="text-h5">Upload Sample</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <p><strong>WARNING:</strong> Uploaded samples are publicly accessible.</p>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-file-input
                      v-model="selectedSample"
                      accept="audio/*"
                      label="Upload a sample!"
                      :rules="[rules.required()]"
                    />
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="sampleName"
                        label="Sample Name"
                        :rules="[rules.required()]"
                      />
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  text
                  @click="uploadSampleDialog = false"
                >
                  Close
                </v-btn>
                <v-btn
                  text
                  :disabled="!isSampleUploadValid"
                  @click="uploadSample"
                >
                  Upload
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-dialog>

        <v-dialog
          v-model="editSampleDialog"
          max-width="600px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              class="mx-3 my-3 mb-5"
              :disabled="playDisabled || allSamples.length === 0"
              v-on="on"
              @click="openEditSampleForm"
            >
              Edit Samples
            </v-btn>
          </template>
          <v-form
            ref="editSampleForm"
            v-model="isEditSampleValid"
            lazy-validation
          >
            <v-card>
              <v-card-title>
                <span class="text-h5">Edit Sample</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row justify="center">
                    <v-select
                      v-model="selectedEditSample"
                      :items="sampleItems"
                      item-text="name"
                      return-object
                      label="Samples"
                      class="mx-3"
                      @change="loadEditSample"
                    />
                  </v-row>

                  <v-row>
                    <p>Sample Length: {{ Math.round(previewSampleLength * 100) / 100 }} Seconds </p>
                  </v-row>

                  <v-row>
                    <v-checkbox
                      v-model="loopPointsEnabled"
                      :disabled="samplePreviewPlaying"
                      label="Use Loop Points"
                      class="mx-3"
                    />
                  </v-row>

                  <v-row>
                    <v-text-field
                      v-model="loopStart"
                      type="number"
                      label="Loop Start Time"
                      class="mx-3"
                      :disabled="!loopPointsEnabled || samplePreviewPlaying"
                      :rules="[rules.gt(-1)]"
                      @change="updatePreviewSamplePlayerLoopPoints"
                    />

                    <v-text-field
                      v-model="loopEnd"
                      type="number"
                      label="Loop End Time"
                      class="mx-3"
                      :disabled="!loopPointsEnabled || samplePreviewPlaying"
                      :rules="[rules.gt(-1), rules.lt(previewSampleLength)]"
                      @change="updatePreviewSamplePlayerLoopPoints"
                    />
                  </v-row>

                  <v-row>
                    <v-text-field
                      v-model="fadeIn"
                      type="number"
                      label="Fade In Time"
                      class="mx-3"
                      :disabled="samplePreviewPlaying"
                      :rules="[rules.gt(-1)]"
                      @change="updatePreviewSamplePlayerFadeIn"
                    />
                  </v-row>

                  <v-row justify="center">
                    <v-btn
                      class="mx-3 mt-3"
                      :loading="previewSampleLoading"
                      @click="previewSample"
                    >
                      {{ previewSampleButtonText }}
                    </v-btn>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  text
                  @click="closeEditSampleForm"
                >
                  Cancel
                </v-btn>
                <v-btn
                  text
                  :disabled="!isEditSampleValid"
                  @click="editSample"
                >
                  Edit
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-dialog>
      </v-col>

      <v-snackbar
        v-model="infoSnackbar"
        timeout="3000"
      >
        {{ infoSnackbarText }}

        <template v-slot:action="{ attrs }">
          <v-btn
            text
            v-bind="attrs"
            @click="infoSnackbar = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>

      <v-snackbar
        v-model="errorSnackbar"
        color="error"
        timeout="3000"
      >
        {{ errorSnackbarText }}

        <template v-slot:action="{ attrs }">
          <v-btn
            text
            v-bind="attrs"
            @click="errorSnackbar = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-row>
  </v-container>
</template>

<script src="./noise.js"></script>
