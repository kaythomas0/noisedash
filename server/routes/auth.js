const express = require('express')
const passport = require('passport')

const router = express.Router()

router.post('/login/password', passport.authenticate('local'), function (req, res, next) {
  console.log('login cookies: ', req.cookies)
  console.log('login is authenticated: ', req.isAuthenticated())
  console.log('/login/password req.user: ', req.user)
  console.log('login session: ', req.session)
  //res.json(req.user)
  return res.send('You were authenticated & logged in!\n');
})

router.get('/auth', function (req, res) {
  console.log('auth cookies: ', req.cookies)
  console.log('in /auth')
  console.log('auth is authenticated: ', req.isAuthenticated())
  console.log('/auth req.user: ', req.user)
  console.log('auth session: ', req.session)
  if (req.user) {
    res.status(200).end()
  } else {
    res.status(401).end()
  }
})

router.get('/logout', function (req, res, next) {
  req.logout()
})

module.exports = router
