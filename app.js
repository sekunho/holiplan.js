let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
const { Pool } = require('pg');

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let plansRouter = require('./routes/plans');
let app = express();
const pool = new Pool();

app.set('db', pool);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/index', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/plans', plansRouter);
// TODO
app.use('/api/tags', plansRouter);

module.exports = app;
