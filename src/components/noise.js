import { Noise, Transport } from "tone";

export default {
  name: "Noise",

  data: () => ({
    startDisabled: false,
    noiseDuration: 4,
    timeRemaining: 0,
    noiseColorOptions: ["pink", "white", "brown"],
    noiseColor: "pink",
    noiseVolume: -10
  }),
  created() {
    this.noise = new Noise()
  },
  methods: {
    handleStart() {
      this.startDisabled = true
      Transport.cancel()
      this.noise = new Noise({volume: this.noiseVolume, type: this.noiseColor}).toDestination()
      this.noise.sync().start(0).stop(this.noiseDuration)
      Transport.start()
      Transport.loopEnd = this.noiseDuration
      this.transportInterval = setInterval(() => this.stopTransport(), this.noiseDuration * 1000 + 100)

      this.timeRemaining = this.noiseDuration
      this.timeRemainingInterval = setInterval(() => this.timer(), 1000)
    },
    stopTransport() {
      clearInterval(this.transportInterval)
      Transport.stop()
      this.startDisabled = false

      clearInterval(this.timeRemainingInterval)
      this.timeRemaining = 0
    },
    timer() {
      this.timeRemaining -= 1
    }
  },
}
