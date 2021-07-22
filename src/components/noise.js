import { Filter, Noise, Transport } from 'tone'

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
    rules: {
      number: value => !isNaN(parseInt(value, 10)) || 'Invalid number',
      negative: value => (!isNaN(parseInt(value, 10)) && value <= 0) || "Can't be greater than 0"
    }
  }),
  created () {
    this.noise = new Noise()
    this.filter = new Filter()
  },
  methods: {
    playNoise () {
      this.startDisabled = true
      Transport.cancel()

      if (this.isFilterEnabled) {
        this.filter = new Filter(this.frequencyCutoff, this.filterType).toDestination()
        this.noise = new Noise({ volume: this.noiseVolume, type: this.noiseColor }).connect(this.filter)
      } else {
        this.noise = new Noise({ volume: this.noiseVolume, type: this.noiseColor }).toDestination()
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
    }
  }
}
