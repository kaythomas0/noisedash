const express = require('express')
const crypto = require('crypto')
const db = require('../db')
const router = express.Router()
const logger = require('../logger')

router.get('/users/current', (req, res) => {
  if (!req.user) {
    return res.sendStatus(401)
  }

  db.get('SELECT is_admin as isAdmin, dark_mode as darkMode, can_upload as canUpload, * FROM users WHERE id = ?', [req.user.id], (err, row) => {
    if (err) {
      logger.error(err)
      return res.sendStatus(500)
    }

    const user = {}

    if (row) {
      user.id = row.id
      user.username = row.username
      user.name = row.name
      user.isAdmin = row.isAdmin === 1
      user.darkMode = row.darkMode === 1
      user.canUpload = row.canUpload === 1
    }

    res.json({ user: user })
  })
})

router.get('/users', (req, res) => {
  if (!req.user) {
    return res.sendStatus(401)
  }

  const users = []

  db.all('SELECT id, username, name, is_admin as isAdmin, can_upload as canUpload FROM users', (err, rows) => {
    if (err) {
      logger.error(err)
      return res.sendStatus(500)
    }

    rows.forEach(row => {
      const user = {}

      user.id = row.id
      user.username = row.username
      user.name = row.name
      user.isAdmin = row.isAdmin === 1
      user.canUpload = row.canUpload === 1

      users.push(user)
    })

    res.json({ users: users })
  })
})

router.post('/users', (req, res) => {
  db.serialize(() => {
    db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
      if (err) {
        logger.error(err)
        return res.sendStatus(500)
      }

      if (row.count !== 0) {
        if (!req.user) {
          return res.sendStatus(401)
        }

        db.get('SELECT is_admin as isAdmin FROM users WHERE id = ?', [req.user.id], (err, row) => {
          if (err) {
            logger.error(err)
            return res.sendStatus(500)
          }

          if (row.isAdmin !== 1) {
            return res.sendStatus(401)
          }

          const salt = crypto.randomBytes(16)
          crypto.pbkdf2(req.body.password, salt, 10000, 32, 'sha256', (err, hashedPassword) => {
            if (err) {
              logger.error(err)
              return res.sendStatus(500)
            }

            db.run(`INSERT INTO users (username, hashed_password, salt, name, is_admin, dark_mode, can_upload)
              VALUES (?, ?, ?, ?, ?, ?, ?)`, [
              req.body.username,
              hashedPassword,
              salt,
              req.body.name,
              req.body.isAdmin,
              req.body.darkMode,
              req.body.canUpload
            ], (err) => {
              if (err) {
                logger.error(err)
                if (err.code === 'SQLITE_CONSTRAINT') {
                  return res.sendStatus(409)
                } else {
                  return res.sendStatus(500)
                }
              }

              return res.sendStatus(200)
            })
          })
        })
      } else {
        const salt = crypto.randomBytes(16)
        crypto.pbkdf2(req.body.password, salt, 10000, 32, 'sha256', (err, hashedPassword) => {
          if (err) {
            logger.error(err)
            return res.sendStatus(500)
          }

          db.run(`INSERT INTO users (username, hashed_password, salt, name, is_admin, dark_mode, can_upload)
            VALUES (?, ?, ?, ?, ?, ?, ?)`, [
            req.body.username,
            hashedPassword,
            salt,
            req.body.name,
            req.body.isAdmin,
            req.body.darkMode,
            req.body.canUpload
          ], function (err) {
            if (err) {
              logger.error(err)
              if (err.code === 'SQLITE_CONSTRAINT') {
                return res.sendStatus(409)
              } else {
                return res.sendStatus(500)
              }
            }

            const user = {
              id: this.lastID.toString(),
              username: req.body.username,
              displayName: req.body.name
            }
            req.login(user, (err) => {
              if (err) {
                logger.error(err)
                return res.sendStatus(500)
              } else {
                return res.sendStatus(200)
              }
            })
          })
        })
      }
    })
  })
})

router.patch('/users/admin/:userId', (req, res) => {
  if (!req.user) {
    return res.sendStatus(401)
  }

  db.serialize(() => {
    db.get('SELECT is_admin FROM users WHERE id = ?', [req.user.id], (err, row) => {
      if (err) {
        logger.error(err)
        return res.sendStatus(500)
      }

      if (row.is_admin === 0) {
        return res.sendStatus(401)
      }
    })

    db.run('UPDATE users SET is_admin = ? WHERE id = ?', [req.body.isAdmin ? 1 : 0, req.params.userId], (err) => {
      if (err) {
        logger.error(err)
        return res.sendStatus(500)
      } else {
        return res.sendStatus(200)
      }
    })
  })
})

router.patch('/users/upload/:userId', (req, res) => {
  if (!req.user) {
    return res.sendStatus(401)
  }

  db.serialize(() => {
    db.get('SELECT is_admin FROM users WHERE id = ?', [req.user.id], (err, row) => {
      if (err) {
        logger.error(err)
        return res.sendStatus(500)
      }

      if (row.is_admin === 0) {
        return res.sendStatus(401)
      }
    })

    db.run('UPDATE users SET can_upload = ? WHERE id = ?', [req.body.canUpload ? 1 : 0, req.params.userId], (err) => {
      if (err) {
        logger.error(err)
        return res.sendStatus(500)
      } else {
        return res.sendStatus(200)
      }
    })
  })
})

router.patch('/users/dark-mode', (req, res) => {
  if (!req.user) {
    return res.sendStatus(401)
  }

  db.serialize(() => {
    db.run('UPDATE users SET dark_mode = ? WHERE id = ?', [req.body.darkMode ? 1 : 0, req.user.id], (err) => {
      if (err) {
        logger.error(err)
        return res.sendStatus(500)
      } else {
        return res.sendStatus(200)
      }
    })
  })
})

router.delete('/users/:userId', (req, res) => {
  if (!req.user) {
    return res.sendStatus(401)
  }

  db.serialize(() => {
    db.get('SELECT is_admin FROM users WHERE id = ?', [req.user.id], (err, row) => {
      if (err) {
        logger.error(err)
        return res.sendStatus(500)
      }

      if (row.is_admin === 0) {
        return res.sendStatus(401)
      }
    })

    db.run('DELETE FROM users WHERE id = ?', [req.params.userId], (err) => {
      if (err) {
        logger.error(err)
        return res.sendStatus(500)
      } else {
        return res.sendStatus(200)
      }
    })
  })
})

module.exports = router
