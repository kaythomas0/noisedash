const express = require('express')
const db = require('../db')

const router = express.Router()

router.post('/', function (req, res, next) {
  if (!req.user) {
    res.sendStatus(401)
  }

  db.run(`INSERT INTO profiles (
    name,
    user,
    timer_enabled,
    timer_seconds,
    volume,
    noise_color,
    filter_enabled,
    filter_type,
    filter_cutoff,
    filter_cutoff_lfo_enabled,
    filter_cutoff_lfo_rate,
    filter_cutoff_lfo_min,
    filter_cutoff_lfo_max,
    tremolo_enabled,
    tremolo_frequency,
    tremolo_depth)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
      req.body.name,
      req.user.id,
      req.body.timerEnabled,
      req.body.timerSeconds,
      req.body.volume,
      req.body.noiseColor,
      req.body.filterEnabled,
      req.body.filterType,
      req.body.filterCutoff,
      req.body.filterCutoffLFOEnabled,
      req.body.filterCutoffLFORate,
      req.body.filterCutoffLFOMin,
      req.body.filterCutoffLFOMax,
      req.body.tremoloEnabled,
      req.body.tremoloFrequency,
      req.body.tremoloDepth
    ],
    function (err) {
      // TODO: Handle error
      console.log(err)
    }
  )
})
