const express = require('express')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const passport = require('passport')
const path = require('path')
const cookieParser = require('cookie-parser')
const config = require('config')
const history = require('connect-history-api-fallback')
const crypto = require('crypto')
const authRouter = require('./routes/auth')
const usersRouter = require('./routes/users')
const profilesRouter = require('./routes/profiles')
const samplesRouter = require('./routes/samples')
const app = express()
const fileStoreOptions = {
  path: config.get('Server.sessionFileStorePath')
}

require('./boot/db')()
require('./boot/auth')()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')))
}

// Workaround for allowing static files to be served while using connect-history-api-fallback
app.use('/samples', express.static(path.join(__dirname, '../', config.get('Server.sampleUploadPath'))))
app.use(history())
app.use('/samples', express.static(path.join(__dirname, '../', config.get('Server.sampleUploadPath'))))

const sessionSecret = crypto.randomBytes(64).toString('hex')
app.use(session({
  store: new FileStore(fileStoreOptions),
  secret: sessionSecret,
  resave: true,
  saveUninitialized: true
}))
app.use((req, res, next) => {
  const msgs = req.session.messages || []
  res.locals.messages = msgs
  res.locals.hasMessages = !!msgs.length
  req.session.messages = []
  next()
})
app.use(passport.initialize())
app.use(passport.authenticate('session'))

// Define routes
app.use('/', authRouter)
app.use('/', usersRouter)
app.use('/', profilesRouter)
app.use('/', samplesRouter)

module.exports = app
