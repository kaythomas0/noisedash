import { Filter, LFO, Noise, Transport, Tremolo } from 'tone'

export default {
  name: 'Noise',

  data: () => ({
    startDisabled: false,
    isTimerEnabled: false,
    noiseDuration: 60,
    timeRemaining: 0,
    noiseColorOptions: ['pink', 'white', 'brown'],
    noiseColor: 'pink',
    noiseVolume: -10,
    isFilterEnabled: false,
    frequencyCutoff: 20000,
    filterTypeOptions: ['lowpass', 'highpass', 'bandpass', 'lowshelf', 'highshelf', 'notch', 'allpass', 'peaking'],
    filterType: 'lowpass',
    isFilterCutoffLFOEnabled: false,
    filterCutoffLFOFrequency: 1,
    filterCutoffLFOMin: 0,
    filterCutoffLFOMax: 20000,
    filterCutoffLFORange: [100, 1000],
    rules: {
      number: value => !isNaN(parseInt(value, 10)) || 'Invalid number',
      negative: value => (!isNaN(parseInt(value, 10)) && value <= 0) || "Can't be greater than 0"
    },
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
    playNoise () {
      this.startDisabled = true
      Transport.cancel()

      // TODO: This conditional logic can be improved
      if (!this.isFilterEnabled && !this.isTremoloEnabled) {
        this.noise = new Noise({ volume: this.noiseVolume, type: this.noiseColor }).toDestination()
      } else if (!this.isFilterEnabled && this.isTremoloEnabled) {
        this.tremolo = new Tremolo({ frequency: this.tremoloFrequency, depth: this.tremoloDepth }).toDestination().start()
        this.noise = new Noise({ volume: this.noiseVolume, type: this.noiseColor }).connect(this.tremolo)
      } else if (this.isFilterEnabled && !this.isTremoloEnabled) {
        this.filter = new Filter(this.frequencyCutoff, this.filterType).toDestination()
        this.noise = new Noise({ volume: this.noiseVolume, type: this.noiseColor }).connect(this.filter)
      } else {
        this.tremolo = new Tremolo({ frequency: this.tremoloFrequency, depth: this.tremoloDepth }).toDestination().start()
        this.filter = new Filter(this.frequencyCutoff, this.filterType).connect(this.tremolo)
        this.noise = new Noise({ volume: this.noiseVolume, type: this.noiseColor }).connect(this.filter)
      }

      if (this.isFilterCutoffLFOEnabled) {
        this.lfo = new LFO({ frequency: this.filterCutoffLFOFrequency, min: this.filterCutoffLFORange[0], max: this.filterCutoffLFORange[1] })
        this.lfo.connect(this.filter.frequency).start()
      }

      if (this.isTimerEnabled) {
        this.noise.sync().start(0).stop(this.noiseDuration)
        Transport.loopEnd = this.noiseDuration
        this.timeRemaining = this.noiseDuration
        this.transportInterval = setInterval(() => this.stopTransport(), this.noiseDuration * 1000 + 100)
        this.timeRemainingInterval = setInterval(() => this.startTimer(), 1000)
      } else {
        this.noise.sync().start(0)
      }

      Transport.start()
    },
    stopTransport () {
      clearInterval(this.transportInterval)
      Transport.stop()
      this.startDisabled = false

      clearInterval(this.timeRemainingInterval)
      this.timeRemaining = 0
    },
    startTimer () {
      this.timeRemaining -= 1
    },
    updateVolume () {
      this.noise.volume.value = this.noiseVolume
    },
    updateNoiseColor () {
      this.noise.type = this.noiseColor
    },
    updateFilterType () {
      this.filter.type = this.filterType
    },
    updateFrequencyCutoff () {
      this.filter.set({ frequency: this.frequencyCutoff })
    },
    updateFilterCutoffLFOFrequency () {
      this.lfo.set({ frequency: this.filterCutoffLFOFrequency })
    },
    updateFilterCutoffLFORange () {
      this.lfo.set({ min: this.filterCutoffLFORange[0], max: this.filterCutoffLFORange[1] })
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
      } else if (this.isFilterEnabled && !this.isFilterCutoffLFOEnabled && !this.isTremoloEnabled) {
        this.filter = new Filter(this.frequencyCutoff, this.filterType).toDestination()
        this.noise.connect(this.filter)
        this.lfo.disconnect()
        this.lfo.stop()
      } else if (this.isFilterEnabled && this.isFilterCutoffLFOEnabled && !this.isTremoloEnabled) {
        this.filter = new Filter(this.frequencyCutoff, this.filterType).toDestination()
        this.noise.connect(this.filter)
        this.lfo = new LFO({ frequency: this.filterCutoffLFOFrequency, min: this.filterCutoffLFORange[0], max: this.filterCutoffLFORange[1] })
        this.lfo.connect(this.filter.frequency).start()
      } else {
        this.tremolo = new Tremolo({ frequency: this.tremoloFrequency, depth: this.tremoloDepth }).toDestination().start()
        this.filter = new Filter(this.frequencyCutoff, this.filterType).connect(this.tremolo)
        this.noise.connect(this.filter)
      }
    }
  }
}
