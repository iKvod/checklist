// 'use strict'
// var TelegramBot = require('node-telegram-bot-api');
// var token = "324830524:AAF_QWatxxdsHbxrC2cB82jxKj8tZmd6wWE";

// var bot = new TelegramBot(token, {polling: true});


// bot.onText(/\/echo (.+)/, function (msg, match) {
//   // 'msg' is the received Message from Telegram
//   // 'match' is the result of executing the regexp above on the text content
//   // of the message

//   var chatId = msg.chat.id;
//   var resp = match[1]; // the captured "whatever"

//   // send back the matched "whatever" to the chat
//   bot.sendMessage(chatId, resp);
// });


// bot.on('image',function(msg){
//     var chatId = msg.chat.id;
//     bot.sendMessage(chatId, "Recieved Your message");
//     console.log(msg);
// });


'use strict';

const Telegram = require('telegram-node-bot'),
    PersistentMemoryStorage = require('./adapters/PersistentMemoryStorage'),
    storage = new PersistentMemoryStorage(
        `${__dirname}/data/userStorage.json`,
        `${__dirname}/data/chatStorage.json`
    ),
    tg = new Telegram.Telegram('324830524:AAF_QWatxxdsHbxrC2cB82jxKj8tZmd6wWE', {
        workers: 1,
        storage: storage
    });

const TodoController = require('./controllers/todos')
    , OtherwiseController = require('./controllers/otherwise');

const todoCtrl = new TodoController();

tg.router.when(new Telegram.TextCommand('/add', 'addCommand'), todoCtrl)
    .when(new Telegram.TextCommand('/get', 'getCommand'), todoCtrl)
    .when(new Telegram.TextCommand('/check', 'checkCommand'), todoCtrl)
    .when(new Telegram.TextCommand('/books', 'booksAddComand', todoCtrl))
    .otherwise(new OtherwiseController());

function exitHandler(exitCode) {
    storage.flush();
    process.exit(exitCode);
}

process.on('SIGINT', exitHandler.bind(null, 0));
process.on('uncaughtException', exitHandler.bind(null, 1));


