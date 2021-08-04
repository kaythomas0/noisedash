const express = require('express')
const crypto = require('crypto')
const db = require('../db')
const router = express.Router()

router.post('/users', function (req, res, next) {
  const salt = crypto.randomBytes(16)
  crypto.pbkdf2(req.body.password, salt, 10000, 32, 'sha256', function (err, hashedPassword) {
    if (err) {
      console.log(err)
      res.sendStatus(500)
    }

    db.run('INSERT INTO users (username, hashed_password, salt, name) VALUES (?, ?, ?, ?)', [
      req.body.username,
      hashedPassword,
      salt,
      req.body.name
    ], function (err) {
      if (err) {
        console.log(err)
        res.sendStatus(500)
      }

      const user = {
        id: this.lastID.toString(),
        username: req.body.username,
        displayName: req.body.name
      }
      req.login(user, function (err) {
        if (err) {
          console.log(err)
          res.sendStatus(500)
        }
      })
    })
  })
  res.sendStatus(200)
})

module.exports = router
