const express = require('express')
const config = require('config')
const multer = require('multer')
const storage = multer.diskStorage({
  destination: config.get('Server.sampleUploadPath'),
  filename: function (req, file, cb) {
    cb(null, req.body.name)
  }
})
const upload = multer({ storage: storage })
const db = require('../db')
const router = express.Router()

router.post('/samples', upload.single('sample'), function (req, res, next) {
  if (!req.user) {
    return res.sendStatus(401)
  }

  db.run('INSERT INTO samples (name, volume, user) VALUES (?, ?, ?)', [
    req.body.name,
    0,
    req.user.id
  ],
  function (err) {
    if (err) {
      return res.sendStatus(500)
    } else {
      return res.sendStatus(200)
    }
  })
})

router.get('/samples', function (req, res) {
  if (!req.user) {
    return res.sendStatus(401)
  }

  const samples = []

  db.all('SELECT id, name, volume FROM samples WHERE user = ?', [req.user.id], function (err, rows) {
    if (err) {
      return res.sendStatus(500)
    }

    rows.forEach(row => {
      const sample = {}

      sample.id = row.id
      sample.name = row.name
      sample.volume = row.volume

      samples.push(sample)
    })

    res.json({ samples: samples })
  })
})

module.exports = router
