const express = require('express')
const crypto = require('crypto')
const db = require('../db')
const router = express.Router()

router.get('/users', function (req, res, next) {
  if (!req.user) {
    return res.sendStatus(401)
  }

  // TODO: I'm guessing there's a better way to marshal this data
  const users = []

  db.all('SELECT username, name, is_admin as isAdmin FROM users', (err, rows) => {
    if (err) {
      console.log('Error getting profiles')
      console.log(err)
      return res.sendStatus(500)
    }

    rows.forEach((row) => {
      const user = {
        username: null,
        name: null,
        isAdmin: null
      }

      user.username = row.username
      user.name = row.name
      user.isAdmin = row.isAdmin === 1

      users.push(user)
    })

    res.json({ users: users })
  })
})

router.post('/users', function (req, res, next) {
  const salt = crypto.randomBytes(16)
  crypto.pbkdf2(req.body.password, salt, 10000, 32, 'sha256', function (err, hashedPassword) {
    if (err) {
      console.log(err)
      res.sendStatus(500)
    }

    db.run('INSERT INTO users (username, hashed_password, salt, name, is_admin) VALUES (?, ?, ?, ?, ?)', [
      req.body.username,
      hashedPassword,
      salt,
      req.body.name,
      req.body.isAdmin
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

router.put('/users', function (req, res, next) {
  if (!req.user) {
    return res.sendStatus(401)
  }

  db.run('UPDATE users SET is_admin = ? WHERE username = ?', [req.body.isAdmin, req.body.username], (err) => {
    if (err) {
      console.log('Error getting profiles')
      console.log(err)
      return res.sendStatus(500)
    }

    console.log(`Row(s) updated: ${this.changes}`)
  })

  res.sendStatus(200)
})

module.exports = router
