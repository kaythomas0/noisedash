const express = require('express')
const config = require('config')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const storage = multer.diskStorage({
  destination: config.get('Server.sampleUploadPath'),
  filename: (req, file, cb) => {
    if (!req.user) {
      const err = new Error('Unauthenticated user attempted to upload sample')
      logger.error(err)
      cb(err, null)
    } else {
      cb(null, req.user.id + '_' + req.body.name)
    }
  }
})
const upload = multer({
  storage: storage,
  limits: { fileSize: config.get('Server.maxSampleSize') }
})
const db = require('../db')
const router = express.Router()
const logger = require('../logger')

router.post('/samples', upload.single('sample'), (req, res, next) => {
  if (!req.user) {
    return res.sendStatus(401)
  }

  db.serialize(() => {
    db.get('SELECT can_upload FROM users WHERE id = ?', [req.user.id], (err, row) => {
      if (err) {
        logger.error(err)
        deleteSample(req.user.id + '_' + req.body.name)
        return res.sendStatus(500)
      }

      if (row.can_upload === 0) {
        deleteSample(req.user.id + '_' + req.body.name)
        return res.sendStatus(401)
      }

      db.run('INSERT INTO samples (name, user) VALUES (?, ?)', [
        req.body.name,
        req.user.id
      ],
      (err) => {
        if (err) {
          logger.error(err)
          deleteSample(req.user.id + '_' + req.body.name)
          if (err.code === 'SQLITE_CONSTRAINT') {
            return res.sendStatus(409)
          } else {
            return res.sendStatus(500)
          }
        } else {
          return res.sendStatus(200)
        }
      })
    })
  })
})

function deleteSample (fileName) {
  fs.unlink(path.join(__dirname, '../../', config.get('Server.sampleUploadPath'), fileName), (err) => {
    if (err) {
      logger.error(err)
    }
  })
}

router.get('/samples', (req, res) => {
  if (!req.user) {
    return res.sendStatus(401)
  }

  const samples = []

  db.all(`SELECT
    id,
    name,
    fade_in as fadeIn,
    loop_points_enabled as loopPointsEnabled,
    loop_start as loopStart,
    loop_end as loopEnd
    FROM samples WHERE user = ?`, [req.user.id], (err, rows) => {
    if (err) {
      logger.error(err)
      return res.sendStatus(500)
    }

    rows.forEach(row => {
      const sample = {}

      sample.id = row.id
      sample.name = row.name
      sample.fadeIn = row.fadeIn
      sample.loopPointsEnabled = row.loopPointsEnabled === 1
      sample.loopStart = row.loopStart
      sample.loopEnd = row.loopEnd
      sample.user = req.user.id

      samples.push(sample)
    })

    res.json({ samples: samples })
  })
})

router.get('/samples/:sampleId', (req, res) => {
  if (!req.user) {
    return res.sendStatus(401)
  }

  db.get(`SELECT
    id,
    name,
    fade_in as fadeIn,
    loop_points_enabled as loopPointsEnabled,
    loop_start as loopStart,
    loop_end as loopEnd
    FROM samples WHERE user = ? AND id = ?`, [req.user.id, req.params.sampleId], (err, row) => {
    if (err) {
      logger.error(err)
      return res.sendStatus(500)
    }

    const sample = {}

    sample.id = row.id
    sample.name = row.name
    sample.fadeIn = row.fadeIn
    sample.loopPointsEnabled = row.loopPointsEnabled === 1
    sample.loopStart = row.loopStart
    sample.loopEnd = row.loopEnd
    sample.user = req.user.id

    res.json({ sample: sample })
  })
})

router.put('/samples/:sampleId', (req, res) => {
  if (!req.user) {
    return res.sendStatus(401)
  }

  db.serialize(() => {
    db.get('SELECT user FROM samples WHERE id = ?', [req.params.sampleId], (err, row) => {
      if (err) {
        logger.error(err)
        return res.sendStatus(500)
      }

      if (row.user.toString() !== req.user.id) {
        return res.sendStatus(401)
      }
    })

    db.run(`UPDATE samples SET
      fade_in = ?,
      loop_points_enabled = ?,
      loop_start = ?,
      loop_end = ?
      WHERE id = ?`, [
      req.body.fadeIn,
      req.body.loopPointsEnabled ? 1 : 0,
      req.body.loopStart,
      req.body.loopEnd,
      req.params.sampleId
    ],
    (err) => {
      if (err) {
        logger.error(err)
        return res.sendStatus(500)
      }

      return res.sendStatus(200)
    })
  })
})

module.exports = router
