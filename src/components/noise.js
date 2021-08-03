import { Filter, LFO, Noise, Transport, Tremolo } from 'tone'

export default {
  name: 'Noise',

  data: () => ({
    selectedProfile: '',
    profileItems: [''],
    profileDialog: false,
    profileName: '',
    playDisabled: false,
    isTimerEnabled: false,
    duration: 60,
    timeRemaining: 0,
    noiseColor: 'pink',
    noiseColorItems: ['pink', 'white', 'brown'],
    volume: -10,
    isFilterEnabled: false,
    filterCutoff: 20000,
    filterType: 'lowpass',
    filterTypeItems: ['lowpass', 'highpass', 'bandpass', 'lowshelf', 'highshelf', 'notch', 'allpass', 'peaking'],
    isLFOFilterCutoffEnabled: false,
    lfoFilterCutoffFrequency: 1,
    lfoFilterCutoffMin: 0,
    lfoFilterCutoffMax: 20000,
    lfoFilterCutoffRange: [100, 1000],
    isTremoloEnabled: false,
    tremoloFrequency: 0.5,
    tremoloDepth: 0.5
  }),
  created () {
    this.noise = new Noise()
    this.filter = new Filter()
    this.tremolo = new Tremolo()
    this.lfo = new LFO()
  },
  methods: {
    play () {
      this.playDisabled = true
      Transport.cancel()

      // TODO: This conditional logic can be improved
      if (!this.isFilterEnabled && !this.isTremoloEnabled) {
        this.noise = new Noise({ volume: this.volume, type: this.noiseColor }).toDestination()
      } else if (!this.isFilterEnabled && this.isTremoloEnabled) {
        this.tremolo = new Tremolo({ frequency: this.tremoloFrequency, depth: this.tremoloDepth }).toDestination().start()
        this.noise = new Noise({ volume: this.volume, type: this.noiseColor }).connect(this.tremolo)
      } else if (this.isFilterEnabled && !this.isTremoloEnabled) {
        this.filter = new Filter(this.filterCutoff, this.filterType).toDestination()
        this.noise = new Noise({ volume: this.volume, type: this.noiseColor }).connect(this.filter)
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
        this.noise.sync().start(0).stop(this.duration)
        Transport.loopEnd = this.duration
        this.timeRemaining = this.duration
        this.transportInterval = setInterval(() => this.stopTransport(), this.duration * 1000 + 100)
        this.timeRemainingInterval = setInterval(() => this.startTimer(), 1000)
      } else {
        this.noise.sync().start(0)
      }

      Transport.start()
    },
    stop () {
      clearInterval(this.transportInterval)
      Transport.stop()
      this.playDisabled = false

      clearInterval(this.timeRemainingInterval)
      this.timeRemaining = 0
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

      // TODO: This conditional logic can be improved
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
      } else {
        this.tremolo = new Tremolo({ frequency: this.tremoloFrequency, depth: this.tremoloDepth }).toDestination().start()
        this.filter = new Filter(this.filterCutoff, this.filterType).connect(this.tremolo)
        this.noise.connect(this.filter)
      }
    },
    loadProfiles () {
      this.$http.get('https://localhost:3000/profiles')
        .then(response => {
          if (response.status === 200) {
            this.profileItems = response.data.profiles
          }
        })
        .catch(function (error) {
          console.error(error.response)
        })
    },
    saveProfile () {
      this.$http.post('https://localhost:3000/profiles', {
        name: this.profileName,
        isTimerEnabled: this.isTimerEnabled ? 1 : 0,
        duration: this.duration,
        volume: this.volume,
        noiseColor: this.noiseColor,
        isFilterEnabled: this.isFilterEnabled ? 1 : 0,
        filterType: this.filterType,
        filterCutoff: this.filterCutoff,
        isLFOFilterCutoffEnabled: this.isLFOFilterCutoffEnabled ? 1 : 0,
        lfoFilterCutoffFrequency: this.lfoFilterCutoffFrequency,
        lfoFilterCutoffLow: this.lfoFilterCutoffRange[0],
        lfoFilterCutoffHigh: this.lfoFilterCutoffRange[1],
        isTremoloEnabled: this.isTremoloEnabled ? 1 : 0,
        tremoloFrequency: this.tremoloFrequency,
        tremoloDepth: this.tremoloDepth
      })
        .then(response => {
          if (response.status === 200) {
            console.log('Profile saved')
          }
        })
        .catch(function (error) {
          console.error(error.response)
        })

      this.profileDialog = false
    }
  }
}
