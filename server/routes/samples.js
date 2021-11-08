const express = require('express')
const config = require('config')
const multer = require('multer')
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
const upload = multer({ storage: storage })
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
        return res.sendStatus(500)
      }

      if (row.can_upload === 0) {
        return res.sendStatus(401)
      }
    })

    db.run('INSERT INTO samples (name, user) VALUES (?, ?)', [
      req.body.name,
      req.user.id
    ],
    (err) => {
      if (err) {
        logger.error(err)
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

router.get('/samples', (req, res) => {
  if (!req.user) {
    return res.sendStatus(401)
  }

  const samples = []

  db.all('SELECT id, name FROM samples WHERE user = ?', [req.user.id], (err, rows) => {
    if (err) {
      logger.error(err)
      return res.sendStatus(500)
    }

    rows.forEach(row => {
      const sample = {}

      sample.id = row.id
      sample.name = row.name
      sample.user = req.user.id

      samples.push(sample)
    })

    res.json({ samples: samples })
  })
})

module.exports = router
