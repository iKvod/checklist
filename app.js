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

var config = require('./config');
var app = express();

mongoose.connect(config.mongoUrl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("Соединение к базе прошло успешно");
});

// //'use strict';
//
// const Telegram = require('telegram-node-bot'),
//     PersistentMemoryStorage = require('./TBhelpers/adapters/PersistentMemoryStorage'),
//     storage = new PersistentMemoryStorage(
//         `${__dirname}/data/userStorage.json`,
//         `${__dirname}/data/chatStorage.json`
//     ),
//     tg = new Telegram.Telegram('324830524:AAF_QWatxxdsHbxrC2cB82jxKj8tZmd6wWE', {
//         workers: 1,
//             webAdmin: {
//         port: 3000,
//         host: 'localhost'
//     },
//         storage: storage
//     });
//
// const TodoController = require('./TBhelpers/controllers/todos')
//     , OtherwiseController = require('./TBhelpers/controllers/otherwise');
//
// const todoCtrl = new TodoController();
//
// tg.router.when(new Telegram.TextCommand('/add', 'addCommand'), todoCtrl)
//     .when(new Telegram.TextCommand('/get', 'getCommand'), todoCtrl)
//     .when(new Telegram.TextCommand('/check', 'checkCommand'), todoCtrl)
//     .when(new Telegram.TextCommand('/books', 'booksAddComand', todoCtrl))
//     .otherwise(new OtherwiseController());
//
// function exitHandler(exitCode) {
//     storage.flush();
//     process.exit(exitCode);
// }
//
// process.on('SIGINT', exitHandler.bind(null, 0));
// process.on('uncaughtException', exitHandler.bind(null, 1));

//
// const Telegram = require('telegram-node-bot')
// const TelegramBaseController = Telegram.TelegramBaseController
// const TextCommand = Telegram.TextCommand
//
// const tg = new Telegram.Telegram('324830524:AAF_QWatxxdsHbxrC2cB82jxKj8tZmd6wWE', {
//     webAdmin: {
//         port: 3000,
//         host: 'localhost'
//     }
// });
//
//
//
// class PingController extends TelegramBaseController {
//     /**
//      * @param {Scope} $
//      */
//     pingHandler($) {
//         $.sendMessage('pong')
//     }
//
//     get routes() {
//         return {
//             'pingCommand': 'pingHandler'
//         }
//     }
// }
//
// tg.router
//     .when(
//         new TextCommand('ping', 'pingCommand'),
//         new PingController()
//     )
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

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + "./public/bower_components"));
app.use(express.static(__dirname + "./public/views/pages"));
app.use(express.static(__dirname + "./public/images"));



app.use(express.static(__dirname + "./public/stylesheets"));

/*
* api's
* */
app.use('/api/bot', botRoutes);
app.use('/api/users', userRoutes);
app.use('/api/checklist', checklistRoutes);
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
