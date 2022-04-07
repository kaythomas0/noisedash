const express = require('express')
const db = require('../db')
const router = express.Router()
const logger = require('../logger')

router.post('/profiles', (req, res) => {
  if (!req.user) {
    return res.sendStatus(401)
  }

  let profileID = 0

  db.serialize(() => {
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
      req.body.isTimerEnabled ? 1 : 0,
      req.body.duration,
      req.body.volume,
      req.body.noiseColor,
      req.body.isFilterEnabled ? 1 : 0,
      req.body.filterType,
      req.body.filterCutoff,
      req.body.isLFOFilterCutoffEnabled ? 1 : 0,
      req.body.lfoFilterCutoffFrequency,
      req.body.lfoFilterCutoffLow,
      req.body.lfoFilterCutoffHigh,
      req.body.isTremoloEnabled ? 1 : 0,
      req.body.tremoloFrequency,
      req.body.tremoloDepth
    ],
    function (err) {
      if (err) {
        logger.error(err)
        if (err.code === 'SQLITE_CONSTRAINT') {
          return res.sendStatus(409)
        } else {
          return res.sendStatus(500)
        }
      }

      profileID = this.lastID

      req.body.samples.forEach(s => {
        db.run('INSERT INTO profiles_samples (profile, sample, volume) VALUES (?, ?, ?)', [
          profileID,
          s.id,
          s.volume
        ],
        (err) => {
          if (err) {
            logger.error(err)
            return res.sendStatus(500)
          }
        })
      })

      return res.json({ id: profileID })
    })
  })
})

router.post('/profiles/import', (req, res) => {
  if (!req.user) {
    return res.sendStatus(401)
  }

  let profileID = 0

  db.serialize(() => {
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
      req.body.isTimerEnabled ? 1 : 0,
      req.body.duration,
      req.body.volume,
      req.body.noiseColor,
      req.body.isFilterEnabled ? 1 : 0,
      req.body.filterType,
      req.body.filterCutoff,
      req.body.isLFOFilterCutoffEnabled ? 1 : 0,
      req.body.lfoFilterCutoffFrequency,
      req.body.lfoFilterCutoffLow,
      req.body.lfoFilterCutoffHigh,
      req.body.isTremoloEnabled ? 1 : 0,
      req.body.tremoloFrequency,
      req.body.tremoloDepth
    ],
    function (err) {
      if (err) {
        logger.error(err)
        if (err.code === 'SQLITE_CONSTRAINT') {
          return res.sendStatus(409)
        } else {
          return res.sendStatus(500)
        }
      }

      profileID = this.lastID

      return res.json({ id: profileID })
    })
  })
})

router.put('/profiles/:profileId', (req, res) => {
  if (!req.user) {
    return res.sendStatus(401)
  }

  db.serialize(() => {
    db.get('SELECT user FROM profiles WHERE id = ?', [req.params.profileId], (err, row) => {
      if (err) {
        logger.error(err)
        return res.sendStatus(500)
      }

      if (row.user.toString() !== req.user.id) {
        return res.sendStatus(401)
      }
    })

    db.run(`UPDATE profiles SET
      timer_enabled = ?,
      duration = ?,
      volume = ?,
      noise_color = ?,
      filter_enabled = ?,
      filter_type = ?,
      filter_cutoff = ?,
      lfo_filter_cutoff_enabled = ?,
      lfo_filter_cutoff_frequency = ?,
      lfo_filter_cutoff_low = ?,
      lfo_filter_cutoff_high = ?,
      tremolo_enabled = ?,
      tremolo_frequency = ?,
      tremolo_depth = ?
      WHERE id = ?`, [
      req.body.isTimerEnabled ? 1 : 0,
      req.body.duration,
      req.body.volume,
      req.body.noiseColor,
      req.body.isFilterEnabled ? 1 : 0,
      req.body.filterType,
      req.body.filterCutoff,
      req.body.isLFOFilterCutoffEnabled ? 1 : 0,
      req.body.lfoFilterCutoffFrequency,
      req.body.lfoFilterCutoffLow,
      req.body.lfoFilterCutoffHigh,
      req.body.isTremoloEnabled ? 1 : 0,
      req.body.tremoloFrequency,
      req.body.tremoloDepth,
      req.params.profileId
    ],
    (err) => {
      if (err) {
        logger.error(err)
        return res.sendStatus(500)
      }

      db.serialize(() => {
        db.run('DELETE FROM profiles_samples WHERE profile = ?', [
          req.params.profileId
        ],
        (err) => {
          if (err) {
            logger.error(err)
            return res.sendStatus(500)
          }
        })

        req.body.samples.forEach(s => {
          db.run('INSERT INTO profiles_samples (profile, sample, volume) VALUES (?, ?, ?)', [
            req.params.profileId,
            s.id,
            s.volume
          ],
          (err) => {
            if (err) {
              logger.error(err)
              return res.sendStatus(500)
            }
          })
        })
      })
      return res.sendStatus(200)
    })
  })
})

router.post('/profiles/default', (req, res) => {
  if (!req.user) {
    return res.sendStatus(401)
  }

  db.serialize(() => {
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
      'Default', req.user.id, 0, 30, -10, 'pink', 0, 'lowpass', 1000,
      0, 0.5, 100, 5000, 0, 0.5, 0.5
    ],
    function (err) {
      if (err) {
        logger.error(err)
        return res.sendStatus(500)
      } else {
        return res.json({ id: this.lastID })
      }
    })
  })
})

router.get('/profiles', (req, res) => {
  if (!req.user) {
    return res.sendStatus(401)
  }

  db.all('SELECT id, name FROM profiles WHERE user = ?', [req.user.id], (err, rows) => {
    if (err) {
      logger.error(err)
      return res.sendStatus(500)
    }

    const profiles = []

    rows.forEach(row => {
      const profile = {}

      profile.id = row.id
      profile.text = row.name

      profiles.push(profile)
    })

    res.json({ profiles: profiles })
  })
})

router.get('/profiles/:profileId', (req, res) => {
  if (!req.user) {
    return res.sendStatus(401)
  }

  db.serialize(() => {
    db.get(`SELECT
      name,
      user,
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
        logger.error(err)
        return res.sendStatus(500)
      }

      if (row.user.toString() !== req.user.id) {
        return res.sendStatus(401)
      }

      const profile = {}

      profile.name = row.name
      profile.isTimerEnabled = row.isTimerEnabled === 1
      profile.duration = row.duration
      profile.volume = row.volume
      profile.noiseColor = row.noiseColor
      profile.isFilterEnabled = row.isFilterEnabled === 1
      profile.filterType = row.filterType
      profile.filterCutoff = row.filterCutoff
      profile.isLFOFilterCutoffEnabled = row.isLFOFilterCutoffEnabled === 1
      profile.lfoFilterCutoffFrequency = row.lfoFilterCutoffFrequency
      profile.lfoFilterCutoffLow = row.lfoFilterCutoffLow
      profile.lfoFilterCutoffHigh = row.lfoFilterCutoffHigh
      profile.isTremoloEnabled = row.isTremoloEnabled === 1
      profile.tremoloFrequency = row.tremoloFrequency
      profile.tremoloDepth = row.tremoloDepth

      db.all('SELECT sample FROM profiles_samples WHERE profile = ?', [req.params.profileId], (err, rows) => {
        if (err) {
          logger.error(err)
          return res.sendStatus(500)
        }

        const sampleQueryArgs = []

        sampleQueryArgs.push(req.params.profileId)

        rows.forEach(row => {
          sampleQueryArgs.push(row.sample)
        })

        db.all(`SELECT samples.id, name, profiles_samples.volume
          FROM samples
          INNER JOIN profiles_samples
          ON profiles_samples.sample = samples.id
          AND profiles_samples.profile = ?
          WHERE samples.id IN ( ` +
        sampleQueryArgs.map(() => { return '?' }).join(',') + ' )', sampleQueryArgs, (err, rows) => {
          if (err) {
            logger.error(err)
            return res.sendStatus(500)
          }

          const samples = []

          rows.forEach(row => {
            const sample = {}

            sample.id = row.id
            sample.name = row.name
            sample.volume = row.volume

            samples.push(sample)
          })

          profile.samples = samples

          res.json({ profile: profile })
        })
      })
    })
  })
})

router.delete('/profiles/:profileId', (req, res) => {
  if (!req.user) {
    return res.sendStatus(401)
  }

  db.serialize(() => {
    db.get('SELECT user FROM profiles WHERE id = ?', [req.params.profileId], (err, row) => {
      if (err) {
        logger.error(err)
        return res.sendStatus(500)
      }

      if (row.user.toString() !== req.user.id) {
        return res.sendStatus(401)
      }
    })

    db.run('DELETE FROM profiles WHERE id = ?', [req.params.profileId], (err) => {
      if (err) {
        logger.error(err)
        return res.sendStatus(500)
      }
    })

    db.run('DELETE FROM profiles_samples WHERE profile = ?', [req.params.profileId], (err) => {
      if (err) {
        logger.error(err)
        return res.sendStatus(500)
      } else {
        return res.sendStatus(200)
      }
    })
  })
})

module.exports = router
