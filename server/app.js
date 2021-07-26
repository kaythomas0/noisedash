const express = require('express')
const session = require('express-session')
const FileStore = require('session-file-store')(session);
const cors = require('cors')
const passport = require('passport')
const path = require('path')
const cookieParser = require('cookie-parser')

const indexRouter = require('./routes/index')
const authRouter = require('./routes/auth')
const myaccountRouter = require('./routes/myaccount')
const usersRouter = require('./routes/users')

const app = express()

const corsOptions = {
  origin: 'http://localhost:8080',
  credentials: true
}

app.use(cors(corsOptions))

const fileStoreOptions = {
  path: './sessions'
};

require('./boot/db')()
require('./boot/auth')()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(session({ store: new FileStore(fileStoreOptions), secret: 'cats', resave: true, saveUninitialized: true }))
app.use(function (req, res, next) {
  const msgs = req.session.messages || []
  res.locals.messages = msgs
  res.locals.hasMessages = !!msgs.length
  req.session.messages = []
  next()
})
app.use(passport.initialize())
app.use(passport.authenticate('session'))
//app.use(passport.session());

// Define routes
app.use('/', indexRouter)
app.use('/', authRouter)
app.use('/myaccount', myaccountRouter)
app.use('/users', usersRouter)

module.exports = app
