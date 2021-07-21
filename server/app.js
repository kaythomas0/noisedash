const express = require('express');
const passport = require('passport');
const path = require('path');
const cookieParser = require('cookie-parser');
const db = require('./db');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
const crypto = require('crypto');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const myaccountRouter = require('./routes/myaccount');
const usersRouter = require('./routes/users');

const app = express();

require('./boot/db')();
require('./boot/auth')();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(function(req, res, next) {
  const msgs = req.session.messages || [];
  res.locals.messages = msgs;
  res.locals.hasMessages = !! msgs.length;
  req.session.messages = [];
  next();
});
app.use(passport.initialize());
app.use(passport.authenticate('session'));

// Define routes
app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/myaccount', myaccountRouter);
app.use('/users', usersRouter);

module.exports = app;

