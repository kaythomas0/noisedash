const express = require('express')
const crypto = require('crypto')
const db = require('../db')
const router = express.Router()

router.get('/users', function (req, res) {
  if (!req.user) {
    return res.sendStatus(401)
  }

  const users = []

  db.all('SELECT id, username, name, is_admin as isAdmin FROM users', (err, rows) => {
    if (err) {
      return res.sendStatus(500)
    }

    rows.forEach((row) => {
      const user = {}

      user.id = row.id
      user.username = row.username
      user.name = row.name
      user.isAdmin = row.isAdmin === 1

      users.push(user)
    })

    res.json({ users: users })
  })
})

router.post('/users', function (req, res) {
  const salt = crypto.randomBytes(16)
  crypto.pbkdf2(req.body.password, salt, 10000, 32, 'sha256', function (err, hashedPassword) {
    if (err) {
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
        res.sendStatus(500)
      }

      const user = {
        id: this.lastID.toString(),
        username: req.body.username,
        displayName: req.body.name
      }
      req.login(user, function (err) {
        if (err) {
          res.sendStatus(500)
        }
      })
    })
  })
  res.sendStatus(200)
})

router.patch('/users/:userId', function (req, res) {
  if (!req.user) {
    return res.sendStatus(401)
  }

  db.get('SELECT is_admin FROM users WHERE id = ?', [req.user.id], (err, row) => {
    if (err) {
      return res.sendStatus(500)
    }

    if (row.is_admin === 0) {
      return res.sendStatus(401)
    }

    db.run('UPDATE users SET is_admin = ? WHERE id = ?', [req.body.isAdmin, req.params.userId], (err) => {
      if (err) {
        return res.sendStatus(500)
      }
    })
  })

  res.sendStatus(200)
})

router.delete('/users/:userId', function (req, res) {
  if (!req.user) {
    return res.sendStatus(401)
  }

  db.get('SELECT is_admin FROM users WHERE id = ?', [req.user.id], (err, row) => {
    if (err) {
      return res.sendStatus(500)
    }

    if (row.is_admin === 0) {
      return res.sendStatus(401)
    }

    db.run('DELETE FROM users WHERE id = ?', [req.params.userId], (err) => {
      if (err) {
        return res.sendStatus(500)
      }
    })
  })

  res.sendStatus(200)
})

module.exports = router
