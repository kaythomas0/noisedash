const express = require('express')
const passport = require('passport')
const db = require('../db')
const router = express.Router()

router.post('/login/password', passport.authenticate('local'), function (req, res, next) {
  return res.send('Authenticated and logged in')
})

router.get('/auth', function (req, res) {
  if (req.user) {
    res.sendStatus(200)
  } else {
    res.sendStatus(401)
  }
})

router.get('/admin', function (req, res) {
  if (!req.user) {
    return res.sendStatus(401)
  }

  db.get('SELECT is_admin FROM users WHERE id = ?', [req.user.id], (err, row) => {
    if (err) {
      return res.sendStatus(500)
    }

    if (row.is_admin === 0) {
      res.sendStatus(401)
    } else {
      res.sendStatus(200)
    }
  })
})

router.get('/logout', function (req, res) {
  req.logout()
  res.sendStatus(200)
})

module.exports = router
