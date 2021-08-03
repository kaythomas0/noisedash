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
    });

    console.log('PROFILES: ')
    res.json({ profiles: profiles })
  })
})

module.exports = router
