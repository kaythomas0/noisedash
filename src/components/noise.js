import { Filter, LFO, Noise, Players, Transport, Tremolo } from 'tone'

export default {
  name: 'Noise',

  data: () => ({
    isTimerValid: false,
    selectedProfile: {},
    profileItems: [],
    profileDialog: false,
    profileName: '',
    isProfileValid: false,
    infoSnackbar: false,
    infoSnackbarText: '',
    playDisabled: false,
    isTimerEnabled: false,
    hours: 0,
    minutes: 0,
    seconds: 30,
    duration: 30,
    timeRemaining: 0,
    noiseColor: 'pink',
    noiseColorItems: ['pink', 'white', 'brown'],
    volume: -10,
    isFilterEnabled: false,
    filterCutoff: 20000,
    filterType: 'lowpass',
    filterTypeItems: ['lowpass', 'highpass', 'bandpass', 'lowshelf', 'highshelf', 'notch', 'allpass', 'peaking'],
    isLFOFilterCutoffEnabled: false,
    lfoFilterCutoffFrequency: 0.5,
    lfoFilterCutoffMin: 0,
    lfoFilterCutoffMax: 20000,
    lfoFilterCutoffRange: [100, 5000],
    isTremoloEnabled: false,
    tremoloFrequency: 0.5,
    tremoloDepth: 0.5,
    isReverbEnabled: false,
    allSamples: [],
    loadedSamples: [],
    selectedSample: null,
    uploadSampleDialog: false,
    addSampleDialog: false,
    checkedSamples: [],
    sampleName: '',
    isSampleUploadValid: false,
    canUpload: false,
    errorSnackbar: false,
    errorSnackbarText: '',
    rules: {
      lt (n) {
        return value => (!isNaN(parseInt(value, 10)) && value < n) || 'Must be less than ' + n
      },
      gt (n) {
        return value => (!isNaN(parseInt(value, 10)) && value > n) || 'Must be greater than ' + n
      },
      required () {
        return value => !!value || 'Required'
      }
    }
  }),
  computed: {
    unloadedSamples: function () {
      const samples = []
      this.allSamples.forEach(s1 => {
        const result = this.loadedSamples.find(s2 => s2.id === s1.id)
        if (!result) {
          samples.push(s1)
        }
      })
      return samples
    }
  },
  created () {
    this.noise = new Noise()
    this.filter = new Filter()
    this.tremolo = new Tremolo()
    this.lfo = new LFO()
    this.players = new Players()
    this.populateProfileItems(0)
    this.getSamples()
    this.getCurrentUser()
  },
  methods: {
    play () {
      this.playDisabled = true
      Transport.cancel()

      if (!this.isFilterEnabled && !this.isTremoloEnabled) {
        this.noise = new Noise({ volume: this.volume, type: this.noiseColor }).toDestination()
      } else if (!this.isFilterEnabled && this.isTremoloEnabled) {
        this.tremolo = new Tremolo({ frequency: this.tremoloFrequency, depth: this.tremoloDepth }).toDestination().start()
        this.noise = new Noise({ volume: this.volume, type: this.noiseColor }).connect(this.tremolo)
      } else if (this.isFilterEnabled && !this.isTremoloEnabled) {
        this.filter = new Filter(this.filterCutoff, this.filterType).toDestination()
        this.noise = new Noise({ volume: this.volume, type: this.noiseColor }).connect(this.filter)
      } else if (this.isFilterEnabled && this.isLFOFilterCutoffEnabled && this.isTremoloEnabled) {
        this.tremolo = new Tremolo({ frequency: this.tremoloFrequency, depth: this.tremoloDepth }).toDestination().start()
        this.filter = new Filter(this.filterCutoff, this.filterType).connect(this.tremolo)
        this.noise.connect(this.filter)
        this.lfo = new LFO({ frequency: this.lfoFilterCutoffFrequency, min: this.lfoFilterCutoffRange[0], max: this.lfoFilterCutoffRange[1] })
        this.lfo.connect(this.filter.frequency).start()
      } else {
        this.tremolo = new Tremolo({ frequency: this.tremoloFrequency, depth: this.tremoloDepth }).toDestination().start()
        this.filter = new Filter(this.filterCutoff, this.filterType).connect(this.tremolo)
        this.noise = new Noise({ volume: this.volume, type: this.noiseColor }).connect(this.filter)
      }

      if (this.isLFOFilterCutoffEnabled) {
        this.lfo = new LFO({ frequency: this.lfoFilterCutoffFrequency, min: this.lfoFilterCutoffRange[0], max: this.lfoFilterCutoffRange[1] })
        this.lfo.connect(this.filter.frequency).start()
      }

      if (this.isTimerEnabled) {
        this.duration = parseInt((this.hours * 3600)) + parseInt((this.minutes * 60)) + parseInt(this.seconds)
        this.noise.sync().start(0).stop(this.duration)
        Transport.loopEnd = this.duration
        this.timeRemaining = this.duration
        this.transportInterval = setInterval(() => this.stop(), this.duration * 1000 + 100)
        this.timeRemainingInterval = setInterval(() => this.startTimer(), 1000)

        this.loadedSamples.forEach(s => {
          this.players.player(s.id).loop = true
          this.players.player(s.id).unsync().sync().start(0).stop(this.duration)
        })
      } else {
        this.noise.sync().start(0)

        this.loadedSamples.forEach(s => {
          this.players.player(s.id).loop = true
          this.players.player(s.id).unsync().sync().start(0)
        })
      }

      Transport.start()
    },
    stop () {
      clearInterval(this.transportInterval)
      Transport.stop()
      this.playDisabled = false

      clearInterval(this.timeRemainingInterval)
      this.timeRemaining = 0
      this.duration = 0
    },
    startTimer () {
      this.timeRemaining -= 1
    },
    updateVolume () {
      this.noise.volume.value = this.volume
    },
    updateNoiseColor () {
      this.noise.type = this.noiseColor
    },
    updateFilterType () {
      this.filter.type = this.filterType
    },
    updateFilterCutoff () {
      this.filter.set({ frequency: this.filterCutoff })
    },
    updateLFOFilterCutoffFrequency () {
      this.lfo.set({ frequency: this.lfoFilterCutoffFrequency })
    },
    updateLFOFilterCutoffRange () {
      this.lfo.set({ min: this.lfoFilterCutoffRange[0], max: this.lfoFilterCutoffRange[1] })
    },
    updateTremoloFrequency () {
      this.tremolo.set({ frequency: this.tremoloFrequency })
    },
    updateTremoloDepth () {
      this.tremolo.set({ depth: this.tremoloDepth })
    },
    updateAudioChain () {
      this.noise.disconnect()

      if (!this.isFilterEnabled && !this.isTremoloEnabled) {
        this.noise.toDestination()
      } else if (!this.isFilterEnabled && this.isTremoloEnabled) {
        this.tremolo = new Tremolo({ frequency: this.tremoloFrequency, depth: this.tremoloDepth }).toDestination().start()
        this.noise.connect(this.tremolo)
      } else if (this.isFilterEnabled && !this.isLFOFilterCutoffEnabled && !this.isTremoloEnabled) {
        this.filter = new Filter(this.filterCutoff, this.filterType).toDestination()
        this.noise.connect(this.filter)
        this.lfo.disconnect()
        this.lfo.stop()
      } else if (this.isFilterEnabled && this.isLFOFilterCutoffEnabled && !this.isTremoloEnabled) {
        this.filter = new Filter(this.filterCutoff, this.filterType).toDestination()
        this.noise.connect(this.filter)
        this.lfo = new LFO({ frequency: this.lfoFilterCutoffFrequency, min: this.lfoFilterCutoffRange[0], max: this.lfoFilterCutoffRange[1] })
        this.lfo.connect(this.filter.frequency).start()
      } else if (this.isFilterEnabled && this.isLFOFilterCutoffEnabled && this.isTremoloEnabled) {
        this.tremolo = new Tremolo({ frequency: this.tremoloFrequency, depth: this.tremoloDepth }).toDestination().start()
        this.filter = new Filter(this.filterCutoff, this.filterType).connect(this.tremolo)
        this.noise.connect(this.filter)
        this.lfo = new LFO({ frequency: this.lfoFilterCutoffFrequency, min: this.lfoFilterCutoffRange[0], max: this.lfoFilterCutoffRange[1] })
        this.lfo.connect(this.filter.frequency).start()
      } else {
        this.tremolo = new Tremolo({ frequency: this.tremoloFrequency, depth: this.tremoloDepth }).toDestination().start()
        this.filter = new Filter(this.filterCutoff, this.filterType).connect(this.tremolo)
        this.noise.connect(this.filter)
      }
    },
    populateProfileItems (profileId) {
      this.$http.get('/profiles')
        .then(response => {
          if (response.status === 200) {
            if (response.data.profiles.length === 0) {
              this.addDefaultProfile()
            } else {
              this.profileItems = response.data.profiles
              this.selectedProfile = this.profileItems.find(p => p.id === profileId + 1)
              this.loadProfile()
            }
          }
        })
        .catch((error) => {
          console.error(error.response)
        })
    },
    addDefaultProfile () {
      this.$http.post('/profiles/default')
        .then(response => {
          if (response.status === 200) {
            const defaultProfile = { id: response.data.id, text: 'Default' }
            this.profileItems = [defaultProfile]
            this.selectedProfile = defaultProfile
          }
        })
        .catch((error) => {
          console.error(error.response)
        })
    },
    saveProfile () {
      this.$http.post('/profiles', {
        name: this.profileName,
        isTimerEnabled: this.isTimerEnabled,
        duration: this.duration,
        volume: this.volume,
        noiseColor: this.noiseColor,
        isFilterEnabled: this.isFilterEnabled,
        filterType: this.filterType,
        filterCutoff: this.filterCutoff,
        isLFOFilterCutoffEnabled: this.isLFOFilterCutoffEnabled,
        lfoFilterCutoffFrequency: this.lfoFilterCutoffFrequency,
        lfoFilterCutoffLow: this.lfoFilterCutoffRange[0],
        lfoFilterCutoffHigh: this.lfoFilterCutoffRange[1],
        isTremoloEnabled: this.isTremoloEnabled,
        tremoloFrequency: this.tremoloFrequency,
        tremoloDepth: this.tremoloDepth,
        samples: this.loadedSamples
      }).then(response => {
        if (response.status === 200) {
          this.profileDialog = false
          this.populateProfileItems(response.data.id - 1)
        }
      })
        .catch((error) => {
          console.error(error.response)
        })
    },
    updateProfile () {
      this.$http.put('/profiles/'.concat(this.selectedProfile.id), {
        isTimerEnabled: this.isTimerEnabled,
        duration: this.duration,
        volume: this.volume,
        noiseColor: this.noiseColor,
        isFilterEnabled: this.isFilterEnabled,
        filterType: this.filterType,
        filterCutoff: this.filterCutoff,
        isLFOFilterCutoffEnabled: this.isLFOFilterCutoffEnabled,
        lfoFilterCutoffFrequency: this.lfoFilterCutoffFrequency,
        lfoFilterCutoffLow: this.lfoFilterCutoffRange[0],
        lfoFilterCutoffHigh: this.lfoFilterCutoffRange[1],
        isTremoloEnabled: this.isTremoloEnabled,
        tremoloFrequency: this.tremoloFrequency,
        tremoloDepth: this.tremoloDepth,
        samples: this.loadedSamples
      }).then(response => {
        if (response.status === 200) {
          this.infoSnackbarText = 'Profile Saved'
          this.infoSnackbar = true
        }
      })
        .catch((error) => {
          console.error(error.response)
          this.errorSnackbarText = 'Error Saving Profile'
          this.errorSnackbar = true
        })
    },
    loadProfile () {
      this.$http.get('/profiles/'.concat(this.selectedProfile.id))
        .then(response => {
          if (response.status === 200) {
            const profile = response.data.profile

            this.isTimerEnabled = profile.isTimerEnabled
            this.duration = profile.duration
            this.volume = profile.volume
            this.noiseColor = profile.noiseColor
            this.isFilterEnabled = profile.isFilterEnabled
            this.filterType = profile.filterType
            this.filterCutoff = profile.filterCutoff
            this.isLFOFilterCutoffEnabled = profile.isLFOFilterCutoffEnabled
            this.lfoFilterCutoffFrequency = profile.lfoFilterCutoffFrequency
            this.lfoFilterCutoffRange[0] = profile.lfoFilterCutoffLow
            this.lfoFilterCutoffRange[1] = profile.lfoFilterCutoffHigh
            this.isTremoloEnabled = profile.isTremoloEnabled
            this.tremoloFrequency = profile.tremoloFrequency
            this.tremoloDepth = profile.tremoloDepth

            this.loadedSamples = profile.samples
          }
        })
        .catch((error) => {
          console.error(error.response)
        })
    },
    deleteProfile () {
      this.$http.delete('/profiles/'.concat(this.selectedProfile.id))
        .then(response => {
          if (response.status === 200) {
            this.populateProfileItems(0)
          }
        })
        .catch((error) => {
          console.error(error.response)
        })
    },
    getSamples () {
      this.$http.get('/samples')
        .then(response => {
          if (response.status === 200) {
            this.allSamples = response.data.samples
            this.allSamples.forEach(s => {
              if (!this.players.has(s.id)) {
                this.players.add(s.id, '/samples/' + s.user + '_' + s.name).toDestination()
              }
            })
          }
        })
        .catch((error) => {
          console.error(error)
        })
    },
    uploadSample () {
      const formData = new FormData()

      formData.append('name', this.sampleName)
      formData.append('sample', this.selectedSample)

      this.$http.post('/samples', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(response => {
          if (response.status === 200) {
            this.getSamples()
          }
        })
        .catch((error) => {
          if (error.response.status === 409) {
            this.errorSnackbarText = 'Upload Failed: Duplicate Sample Name'
            this.errorSnackbar = true
          }
          console.error(error.response)
        })

      this.uploadSampleDialog = false
    },
    addSample () {
      this.checkedSamples.forEach(i => {
        const load = this.allSamples.find(e => e.id === i)
        load.volume = -10
        this.loadedSamples.push(load)
      })

      this.addSampleDialog = false
      this.checkedSamples = []
    },
    updateSampleVolume (id, index) {
      this.players.player(id).volume.value = this.loadedSamples[index].volume
    },
    removeSample (index) {
      this.loadedSamples.splice(index, 1)
    },
    getCurrentUser () {
      this.$http.get('/users/current')
        .then(response => {
          if (response.status === 200) {
            this.canUpload = response.data.user.canUpload
            this.$vuetify.theme.dark = response.data.user.darkMode
          }
        })
        .catch((error) => {
          console.error(error.response)
        })
    }
  }
}
