const express = require('express')
const session = require('express-session')
const FileStore = require('session-file-store')(session);
const cors = require('cors')
const passport = require('passport')
const path = require('path')
const cookieParser = require('cookie-parser')
const config = require('config')

const authRouter = require('./routes/auth')
const usersRouter = require('./routes/users')
const profilesRouter = require('./routes/profiles')

const app = express()

const corsOptions = {
  origin: 'http://localhost:'.concat(config.get('Client.listeningPort')),
  credentials: true
}

app.use(cors(corsOptions))

const fileStoreOptions = {
  path: config.get('Server.sessionFileStorePath')
};

require('./boot/db')()
require('./boot/auth')()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(session({ store: new FileStore(fileStoreOptions), secret: config.get('Server.sessionSecret'), resave: true, saveUninitialized: true }))
app.use(function (req, res, next) {
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
app.use('/users', usersRouter)
app.use('/profiles', profilesRouter)

module.exports = app
