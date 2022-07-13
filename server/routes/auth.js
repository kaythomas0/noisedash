const express = require('express')
const passport = require('passport')
const db = require('../db')
const router = express.Router()
const logger = require('../logger')

router.post('/login/password', passport.authenticate('local'), (req, res, next) => {
  return res.send('Authenticated and logged in')
})

router.get('/auth', (req, res) => {
  if (req.user) {
    res.sendStatus(200)
  } else {
    res.sendStatus(401)
  }
})

router.get('/admin', (req, res) => {
  if (!req.user) {
    return res.sendStatus(401)
  }

  db.get('SELECT is_admin FROM users WHERE id = ?', [req.user.id], (err, row) => {
    if (err) {
      logger.error(err)
      return res.sendStatus(500)
    }

    if (row.is_admin === 0) {
      res.sendStatus(401)
    } else {
      res.sendStatus(200)
    }
  })
})

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      logger.error(err)
      res.sendStatus(500)
    } else {
      res.sendStatus(200)
    }
  })
})

router.get('/setup', (req, res) => {
  db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
    if (err) {
      logger.error(err)
      return res.sendStatus(500)
    }

    if (row.count === 0) {
      return res.json({ setup: true })
    } else {
      return res.json({ setup: false })
    }
  })
})

module.exports = router
