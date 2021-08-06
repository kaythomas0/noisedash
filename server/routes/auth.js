const express = require('express')
const passport = require('passport')
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

router.get('/logout', function (req, res, next) {
  req.logout()
  res.sendStatus(200)
})

module.exports = router
