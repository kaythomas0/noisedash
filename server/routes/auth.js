const express = require('express')
const passport = require('passport')

const router = express.Router()

router.post('/login/password', passport.authenticate('local'), function (req, res, next) {
  if (req.user) {
    res.json(req.user)
  } else {
    res.statusCode = 403
  }
})

router.get('/logout', function (req, res, next) {
  req.logout()
})

module.exports = router
