'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var botRoutes = require('./routes/botRoutes');
var userRoutes = require('./routes/userRoutes');
var checklistRoutes = require('./routes/checklist');
var reportRoutes = require('./routes/reportsRoute');
var salaryRoutes = require('./routes/reportSalary');
var bookRoutes = require('./routes/booksRoutes');
var deptRoutes = require('./routes/departmentRoutes');
var idGenrRoutes = require('./routes/idGenerRoute');
var psnRoutes = require('./routes/postionsRoute');

var config = require('./config');
var app = express();
// mongoose.connect(config.mongoUrl, config.opt);
mongoose.connect(config.mongoUrl);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("Соединение к базе прошло успешно");
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));

var allowCrossDomain = function(req, res, next) {
    if ('OPTIONS' == req.method) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
        res.send(200);
    }
    else {
        next();
    }
};

app.use(allowCrossDomain);
app.use(cookieParser());



app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + "./public/bower_components"));
app.use(express.static(__dirname + "./public/views/pages"));
app.use(express.static(__dirname + "./public/images"));
app.use(express.static(__dirname + "./public/stylesheets"));
app.use(express.static(__dirname + "./public/photos"));
app.use(express.static(__dirname + "./public/components"));


/*
* api's
* */
app.use('/api/users', userRoutes);
app.use('/api/bot', botRoutes);
app.use('/api/checklist', checklistRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/salary', salaryRoutes);
app.use('/api/books', bookRoutes);
//app.use('/api/dpts', deptRoutes);
app.use('/api/depts', deptRoutes);
app.use('/api/positions', psnRoutes)
app.use('/api/generators', idGenrRoutes);
app.use('/*', function(req, res){
      res.sendFile(path.join(__dirname + '/public/index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
