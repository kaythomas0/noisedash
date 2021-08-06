const express = require('express')
const db = require('../db')
const router = express.Router()

router.post('/profiles', function (req, res, next) {
  if (!req.user) {
    return res.sendStatus(401)
  }

  console.log(req.body)

  db.run(`INSERT INTO profiles (
    name,
    user,
    timer_enabled,
    duration,
    volume,
    noise_color,
    filter_enabled,
    filter_type,
    filter_cutoff,
    lfo_filter_cutoff_enabled,
    lfo_filter_cutoff_frequency,
    lfo_filter_cutoff_low,
    lfo_filter_cutoff_high,
    tremolo_enabled,
    tremolo_frequency,
    tremolo_depth)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
    req.body.name,
    req.user.id,
    req.body.isTimerEnabled,
    req.body.duration,
    req.body.volume,
    req.body.noiseColor,
    req.body.isFilterEnabled,
    req.body.filterType,
    req.body.filterCutoff,
    req.body.isLFOFilterCutoffEnabled,
    req.body.lfoFilterCutoffFrequency,
    req.body.lfoFilterCutoffLow,
    req.body.lfoFilterCutoffHigh,
    req.body.isTremoloEnabled,
    req.body.tremoloFrequency,
    req.body.tremoloDepth
  ],
  function (err) {
    if (err) {
      console.log(err)
      return res.sendStatus(500)
    }

    res.sendStatus(200)
  }
  )
})

router.get('/profiles', function (req, res, next) {
  if (!req.user) {
    return res.sendStatus(401)
  }

  const profiles = []

  db.all('SELECT name FROM profiles WHERE user = ?', [req.user.id], (err, rows) => {
    if (err) {
      console.log('Error getting profiles')
      console.log(err)
      return res.sendStatus(500)
    }

    rows.forEach((row) => {
      profiles.push(row.name)
      console.log(row.name)
    })

    console.log('PROFILES: ')
    res.json({ profiles: profiles })
  })
})

router.get('/profiles/:profileId', function (req, res, next) {
  if (!req.user) {
    return res.sendStatus(401)
  }

  // TODO: I'm guessing there's a better way to marshal this data
  const profile = {
    name: null,
    isTimerEnabled: null,
    duration: null,
    volume: null,
    noiseColor: null,
    isFilterEnabled: null,
    filterType: null,
    isLFOFilterCutoffEnabled: null,
    lfoFilterCutoffFrequency: null,
    lfoFilterCutoffLow: null,
    lfoFilterCutoffHigh: null,
    isTremoloEnabled: null,
    tremoloFrequency: null,
    tremoloDepth: null
  }

  db.get(`SELECT
    name,
    timer_enabled as isTimerEnabled,
    duration,
    volume,
    noise_color as noiseColor,
    filter_enabled as isFilterEnabled,
    filter_type as filterType,
    filter_cutoff as filterCutoff,
    lfo_filter_cutoff_enabled as isLFOFilterCutoffEnabled,
    lfo_filter_cutoff_frequency as lfoFilterCutoffFrequency,
    lfo_filter_cutoff_low as lfoFilterCutoffLow,
    lfo_filter_cutoff_high as lfoFilterCutoffHigh,
    tremolo_enabled as isTremoloEnabled,
    tremolo_frequency as tremoloFrequency,
    tremolo_depth as tremoloDepth
    FROM profiles WHERE id = ?`, [req.params.profileId], (err, row) => {
    if (err) {
      console.log('Error getting profile')
      console.log(err)
      return res.sendStatus(500)
    }

    profile.name = row.name
    profile.isTimerEnabled = row.isTimerEnabled
    profile.duration = row.duration
    profile.volume = row.volume
    profile.noiseColor = row.noiseColor
    profile.isFilterEnabled = row.isFilterEnabled
    profile.filterType = row.filterType
    profile.isLFOFilterCutoffEnabled = row.isLFOFilterCutoffEnabled
    profile.lfoFilterCutoffFrequency = row.lfoFilterCutoffFrequency
    profile.lfoFilterCutoffLow = row.lfoFilterCutoffLow
    profile.lfoFilterCutoffHigh = row.lfoFilterCutoffHigh
    profile.isTremoloEnabled = row.isTremoloEnabled
    profile.tremoloFrequency = row.tremoloFrequency
    profile.tremoloDepth = row.tremoloDepth

    console.log('PROFILES: ')
    res.json({ profile: profile })
  })
})

module.exports = router
