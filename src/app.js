let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
const { Pool } = require('pg');
const auth = require('./holiplan_web/middleware/auth');

let indexRouter = require('./holiplan_web/routes/index');
let usersRouter = require('./holiplan_web/routes/users');
let plansRouter = require('./holiplan_web/routes/plans');
let app = express();
const pool = new Pool();

app.set('db', pool);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(auth);

app.use('/api/index', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/plans', plansRouter);
// TODO
app.use('/api', usersRouter);

module.exports = app;
