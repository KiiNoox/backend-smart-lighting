var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('./config/database');
var nodemailer = require('nodemailer');
const fs = require('fs');
const multer = require('multer');
const csv = require('csvtojson');
const payloadChecker = require('payload-validator');
var cors = require('cors');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var AreaRouter = require('./routes/Area');
var LocationProfileRouter = require('./routes/LocationProfile');
var LigneRouter = require('./routes/Ligne');
var DeviceRouter = require('./routes/Device');
var ProfileRouter = require('./routes/Profile');
var LicenseRouter = require('./routes/License');
const kafkacontroller = require('./kafkaControllers/consumerController');
const kafkacontroller2 = require('./kafkaControllers/consumer2Controller');
const kafkacontroller3 = require('./kafkaControllers/consumer3Controller');
const kafkacontroller4 = require('./kafkaControllers/consumer4Profile');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");

  next();
});



app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/Area', AreaRouter);
app.use('/api/Ligne', LigneRouter);
app.use('/api/Device', DeviceRouter);
app.use('/api/Profile', ProfileRouter);
app.use('/api/LocationProfile', LocationProfileRouter);
app.use('/api/License', LicenseRouter);
app.use('/api/kafka', kafkacontroller);
app.use('/api/kafka2', kafkacontroller2);
app.use('/api/kafka3', kafkacontroller3);
app.use('/api/kafka3', kafkacontroller4);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
