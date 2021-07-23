const express = require('express');
const session = require('express-session')
const cors = require('cors')
const passport = require('passport');
const path = require('path');
const cookieParser = require('cookie-parser');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
const bodyParser = require("body-parser")

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const myaccountRouter = require('./routes/myaccount');
const usersRouter = require('./routes/users');
const db = require('./db');

const app = express();

require('./boot/db')();
require('./boot/auth')();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(function(req, res, next) {
  const msgs = req.session.messages || [];
  res.locals.messages = msgs;
  res.locals.hasMessages = !! msgs.length;
  req.session.messages = [];
  next();
});
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.authenticate('session'));
app.use(cors())

// Define routes
app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/myaccount', myaccountRouter);
app.use('/users', usersRouter);

module.exports = app;
