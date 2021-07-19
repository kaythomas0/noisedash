import { Filter, Noise, Transport } from "tone";

export default {
  name: "Noise",

  data: () => ({
    startDisabled: false,
    noiseDuration: 4,
    timeRemaining: 0,
    noiseColorOptions: ["pink", "white", "brown"],
    noiseColor: "pink",
    noiseVolume: -10,
    isFilterEnabled: false,
    frequencyCutoff: 20000,
    filterTypeOptions: ["lowpass", "highpass", "bandpass", "lowshelf", "highshelf", "notch", "allpass", "peaking"],
    filterType: "lowpass"
  }),
  created() {
    this.noise = new Noise()
  },
  methods: {
    playNoise() {
      this.startDisabled = true
      Transport.cancel()

      this.filter = new Filter(this.frequencyCutoff, this.filterType).toDestination()

      if (this.isFilterEnabled) {
        this.noise = new Noise({volume: this.noiseVolume, type: this.noiseColor}).connect(this.filter)
      } else {
        this.noise = new Noise({volume: this.noiseVolume, type: this.noiseColor}).toDestination()
      }
      this.noise.sync().start(0).stop(this.noiseDuration)

      Transport.start()
      Transport.loopEnd = this.noiseDuration

      this.transportInterval = setInterval(() => this.stopTransport(), this.noiseDuration * 1000 + 100)

      this.timeRemaining = this.noiseDuration
      this.timeRemainingInterval = setInterval(() => this.startTimer(), 1000)
    },
    stopTransport() {
      clearInterval(this.transportInterval)
      Transport.stop()
      this.startDisabled = false

      clearInterval(this.timeRemainingInterval)
      this.timeRemaining = 0
    },
    startTimer() {
      this.timeRemaining -= 1
    }
  },
}
