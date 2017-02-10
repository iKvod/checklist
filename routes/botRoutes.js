'use strict';

var express = require('express');
var botrouter = express.Router();
var upload = require('multer')();
var fs = require('fs');

//Models
var User = require('../models/user');
var Books = require('../models/book');
var Employees = require('../models/employees');

var TelegramBot = require('node-telegram-bot-api');
var token = "324830524:AAF_QWatxxdsHbxrC2cB82jxKj8tZmd6wWE";
//@checklistAutomato2_bot bot for testing
var token2 = "308572160:AAG4WW0OA9qdLK1bakj7-edMxS-P1vriedY";
var bot = new TelegramBot(token, {polling: true});


// var options = {
//     webHook: {
//         port: 443,
//         key: `${__dirname}/cert/key.pem`,
//         cert: `${__dirname}/cert/cert.pem`
//     }
// };
//
// //var url = 'https://checklist.automato.me>';
// var url = 'https://188.166.182.2/';
// var bot = new TelegramBot(token, options);
//
// //
// bot.setWebHook(`${url}/bot${token}`, {
//     certificate: options.webHook.cert,
// });

//bot.deleteWebHook();


/*
*
* DIRECTLY FROM TELEGRAM BOT
*
* */

//employee will be registred when he start using @automatochecklistbot

// /register employee_id firstname lastname email phonenumber department position

bot.onText(/\/register (.+) (.+) (.+) (.+) (.+) (.+) (.+)/, function(msg, match){
    //console.log(msg);

    var userId = msg.from.username;
    var chatId = msg.chat.id;
    var code = generateCode();
    var newId = match[1].toLowerCase();
    var firstname = match[2].charAt(0).toUpperCase() + match[2].substr(1);
    var lastname = match[3].charAt(0).toUpperCase() + match[3].substr(1);
    var email = match[4].toLowerCase();
    var phonenumber = match[5];
    var department = match[6].toUpperCase();
    var position = match[7].charAt(0).toUpperCase() + match[7].substr(1);;

    var user = new User({
        employee_id: newId,
        botId: msg.from.id,
        username:msg.from.username,
        firstname: firstname,
        lastname: lastname,
        email:email,
        phonenumber:phonenumber,
        department: department,
        position: position,
        code: code
    });

    user.save(function(err, user){
        if(err) {
           // console.log("Ошибка при сохранений: " + err.errmsg);
            bot.sendMessage(chatId, "Извините, Вы уже зарегистрированы");
            return ;
        }
        console.log(user);
        // var emp = new Employees();
        // emp.save(err, function (err, savedEmp) {
        //    // console.log(savedEmp);
        // });
        bot.sendMessage(chatId, user.firstname +  ', вы зарегистрированы в системе\n' + " Ваш ID " + user.employee_id);
    });
});
bot.onText(/\/start/, function (msg, match) {
    var userId = msg.from.id;
    var opt = {
        'parse_mode':"Markdown",
        // 'reply_markup': {
        //     "keyboard":[
        //         [{text: 'YES'}],
        //         [{text: 'NO'}]
        //     ],
        //     "resize_keyboard" : true,
        //     "one_time_keyboard" : true
        // }
    };

    var message = "Чтобы зарегистритоваться в системе вам нужно\n"
        + "набрать команду * в той же последовательноcти * как ниже:\n\t\t"
        + "/register ID firstname lastname email mobile department position\n\n"
        + "P.S. после регистраций наберите /info для получений списков команд\n";

    bot.sendMessage(userId, message, opt);

});


// for new users
/*bot.onText(/\/start/, function(msg, match){

    var userId = msg.from.username;
    var chatId = msg.chat.id;
    var code = generateCode();

//    var newEmployee = new Employees({});
    var newId = "some id";

    newEmployee.save(function (err, emp) {
        if(err) {console.log(err); return }

        var user = new User({
            employee_id: newId,
            botId: msg.from.id,
            username:msg.from.username,
            firstname:msg.from.first_name,
            lastname:msg.from.last_name,
            code: code
        });

        user.save(function(err, user){
            if(err) {
                console.log("Ошибка при сохранений: " + err.errmsg);
                bot.sendMessage(chatId, "Извините Вы уже зарегистрированы");
                return ;
            }
            bot.sendMessage(chatId, 'You are saved to database, Dude!' + " and your id is " + user.employee_id);
        });
        //createUser(getEmployyesCount,generateId);
    });
});*/


//helper functions to /start command
// random id generator. used when employee starts using @automatochecklistbot

function createUser(callback, generateId) {

    var newId = callback(generateId);

    var user = new User({
        employee_id: newId,
        botId: msg.from.id,
        username:msg.from.username,
        firstname:msg.from.first_name,
        lastname:msg.from.last_name,
        code: code
    });

    user.save(function(err, user){
        if(err) {
            console.log("Ошибка при сохранений: " + err.errmsg);
            bot.sendMessage(chatId, "Извините Вы уже зарегистрированы");
            return ;
        }
        bot.sendMessage(chatId, 'You are saved to database, Dude!' + " and your id is " + user.employee_id);
    });
}
function generateId(count){
    var date = new Date();
    var year = date.getFullYear().toString().substr(2);
    var dep = 'IT';
    var newId = year + dep + count;
    return newId;
    console.log(newId);
}

function getEmployyesCount (callback){
    var count = 0;

    Employees.findOne({})
        .select({ number:1 })
        .exec(function (err, employee) {
            if(err) {console.log(err); return}
            count = employee.number;
            callback(count);
        });
}


function generateCode (){
    var code = [];
    var index = Math.floor(Math.random() * (9 - 8) + 8);

    for(var i = 0; i < index; ++i){
        var number = Math.floor(Math.random() * (9000 - 1000) + 1000);
        code[i] = number;
        // console.log(code[i] = number);
    }
    return code;
}


/*
 *TELEGRAM BOT commands for reporting
 * /sendbook@touser
 * /sendbook [users id] [link to book | Name of book ]
 * /sendbook@toserver
 * */

// Get user info: will show telegram ID
// telegram id will be provided to send by it the link to book

bot.onText(/\/info/, function (msg, match) {
    var userId = msg.chat.id;

    var message = "Доступные команды для работы с книгами:\n"
        + "1) /info - команда для получения информации о доступных командах для бота\n"
        + "2) /userinfo - информации о сотрудниках\n"
        + "3) /sendbook@touser <Название книги | Ссылка на веб ресурс> <ID сотрудника> - отправка книги определенному сотруднику\n"
        + "4) /sendbook@toserver <link | title > - отправка книги на сервер ввиде ссылки или Названия книги\n"
        + "5) /getbookinfo <ID сотрудника> - для получения списка книг сотрудников\n"
        + "6) @automatoChecklist_bot - название бота Checklist Automato\n";

    bot.sendMessage(userId, message);
});


// /info - informations about users
bot.onText(/\/👤 (.+) (.+)/, function (msg, match) {
    User.find({})
        .select({employee_id:1, firstname:1})
        .exec(function (err, data) {
            console.log(data);
            var text = '';
            var it = 0;
            data.forEach(function(user){
                it++;
                text += it + ") ID сотрудника:"+ user.employee_id + " Имя: " + user.firstname + " " + "\n";
            });

            bot.sendMessage(msg.chat.id, text);
        })
});

///sendbook@touser <Название книги> <ID сотрудника>
bot.onText(/\/sendbook@touser (.+) (.+)/, function (msg, match) {

    var title = match[1]
   // console.log(title);
    var id = match[2];
 //   console.log(id);

    User.findOne({ employee_id: id})
        .select({ _id: 1, botId: 1, book: 1 })
        .exec(function (err, data) {
            //console.log(data);
            if (err) {console.log(err); return };
            var book = new Books({
               title: title,
                employee: data._id
            });

            book.save(function(err, bookSaved){
                if(err) { console.log(err); return }

                data.book.push(bookSaved._id);

                data.save(function (err, savedUser) {
                   if(err) {console.log(err); return }
                   console.log(savedUser)
                });
            });

            sendBook(':', title, sendBookInfo, title, data.botId);

        });
});

function sendBook(sep, str, callback, title, botId) {
   var strData = str.split(sep);
     console.log("GEre");
    callback(strData[0], title, botId);
}

function sendBookInfo(http, title, botId) {

    if( (http === 'https') || (http === 'http') ){
        var opt = {
            'parse_mode':"Markdown"
        };
        bot.sendMessage(botId, '[КНИГА📕]('+ title +')', opt);
    } else {
        var text = "Вам нужно прочитать книгу:\n\t" + title;
        bot.sendMessage(botId, text);
    }
}
// /sendbook@toserver <link | title >
bot.onText(/\/sendbook@toserver (.+)/, function (msg, match) {
    var text = match[1];
    saveBook(':', text, stringSeparator);
});

function stringSeparator(sep, string) {
    var strData = string.split(sep);
    return strData[0];
}

function saveBook(sep, text, callback) {
    var http = callback(sep, text);
    if((http === 'http') || (http === 'https')){
        var book = new Books({
            link: text,
            required: true
        });
        book.save(function (err, data) {
           if(err){
               console.log(err); return
           }
            var id = data._id;  
           
           User.find({})
               .exec(function (err, users) {
                   var len = users.length;
                    for (var i = 0; i < len; i ++){
                        users[i].book.push(id);
                        users[i].save(function (err, savedUsers) {
                            if(err) {console.log(err); return}

                            console.log(savedUsers);
                        });
                    }
               })
        });

    } else {
        var book = new Books({
            title: text,
            required: true
        });
        book.save(function (err, data) {
            if(err){
                console.log(err); return
            }
            var id = data._id;

            User.find({})
                .exec(function (err, users) {
                    var len = users.length;
                    for (var i = 0; i < len; i ++){
                        users[i].book.push(id);
                        users[i].save(function (err, savedUsers) {
                            if(err) {console.log(err); return}
                            console.log(savedUsers);
                        })
                    }


                });
        });
    }
}

//Get employees books info
bot.onText(/\/getbookinfo (.+)/,function (msg, match) {
    var userId = msg.chat.id;
    User.findOne({employee_id: match[1]})
        .populate('book')
        .select({book:1, firstname:1})
        .exec(function (err, data) {

            if(err) {
                console.log(err);
                bot.sendMessage(userId, "Ошибка, попробуйте через некоторое время!\n");
                return;
            }


            if(data.book.length === 0){
                bot.sendMessage(userId, "Возможно, он уже прочитал книги!\n" + " Отправьте ему книги");
            } else {
                for (var i = 0, len = data.book.length; i < len; i++){
                    var message = i+1 + " " + data.book[i] + " \n"
                }
                bot.sendMessage(userId, "dsds");
            }
        });
});

// TIME REPORTING FOR EMPLOYEES
/*
*TELEGRAM BOT commands for reporting
* /tolunch
* /fromlunch
* /stopwork
* /startwork
*
*
* */
bot.onText(/\/🍔tolunch/, function(msg, match){
    var chatId = msg.chat.id;
    var name = msg.chat.user_name;

    bot.sendMessage(chatId, name + ": I'm going to have a lunch!");
});

bot.onText(/\/fromlunch🍔/, function(msg, match){
    var chatId = msg.chat.id;
    var name = msg.chat.user_name;

    bot.sendMessage(chatId, name + ': I came from lunch');
});

bot.onText(/\/⚔️stopwork/, function(msg, match){
    var chatId = msg.chat.id;
    var name = msg.chat.user_name;

    bot.sendMessage(chatId, name +  ': Stop working');
});

bot.onText(/\/👨🏼‍💻starkwork👩🏼‍💻/, function(msg, match){
    var chatId = msg.chat.id;
    var name = msg.chat.user_name;

    bot.sendMessage(chatId, name + ': Start working');
});

/*
* API checklist
* from web client
* */

//gathering snapchot image and reports and sending it to bot
botrouter.post('/image', function (req, res, next) {
    //console.log(req.body);
    var date = new Date();
    var time = date.toLocaleString();
    var id = req.body.report.id;
    var b64Data = req.body.image;
    var message = req.body.report.message;
   // console.log(message);
    var report = req.body.report.report;
    //console.log(report !== undefined)
    var bookReport = req.body.report.bookreport;
    //console.log(bookReport !== undefined);
    var caption = '';

    if(message && report && bookReport){
        caption = time + "\n" + message + "\n" + report + "\n" + "Мои заметки по книге: "+ bookReport + "\n";
        //console.log("1"+caption)
    } else if (message && (report !== undefined) && (bookReport === undefined) ) {
        caption = time + "\n" + message + "\n" + report + "\n" + "Я еще не прочел книгу" + "\n";
       // console.log("2"+message);
    } else if(message && (report === undefined) && (bookReport === undefined)){
        caption = time + "\n"+ message;
        //console.log("3"+caption);
    }

    var buffer = new Buffer(b64Data, 'base64');
   // bot.sendMessage(207925830,'_'+report+'_', {'parse_mode':"Markdown"});
    //var url = "https://www.google.kz/imgres?imgurl=https://lh5.googleusercontent.com/-89xTT1Ctbrk/AAAAAAAAAAI/AAAAAAAABcc/Kg0vilTzpKI/s0-c-k-no-ns/photo.jpg&imgrefurl=https://plus.google.com/u/0/114461178896543099856&h=349&w=349&tbnid=xioshf3NC0EdIM:&vet=1&tbnh=186&tbnw=186&docid=Crf5bkJhI8aTfM&itg=1&usg=__TtEAsURjtwX5OnkvlM3Ngw4WYsg=&sa=X&ved=0ahUKEwjn4KbdhO_RAhUFS5oKHW3BCu8Q_B0IczAK&ei=CueRWOezJYWW6QTtgqv4Dg#h=349&imgrc=xioshf3NC0EdIM:&tbnh=186&tbnw=186&vet=1&w=349";
    var opt = {
        "caption": caption,
        // 'reply_markup': { // for rating
        //             "keyboard":[
        //                 [{text: '👍'}],
        //                 [{text: '👎'}]
        //             ],
        //             "resize_keyboard" : true,
        //             "one_time_keyboard" : true,
        //             "remove_keyboard":true
        //     }
    };

    bot.sendPhoto(78923920, buffer, opt);
    bot.sendMessage(228106138, caption);
    bot.sendMessage(207925830, caption);
    bot.sendPhoto(207925830, buffer, opt);

    fs.writeFile('./public/photos/' + date.getTime() + "_" + id + '.jpeg', buffer, function(e){
        if(e) {
            console.log(e)
        }
    });

    res.send("OK");
});

bot.on('sticker',function(msg){
    var chatId = msg.chat.id;
    bot.sendMessage(chatId, "Recieved Your sticker");
});

var mes = 'message';
var bookData = [];
var optionCeo = {
    'reply_markup': {
        "keyboard":[
            [{text: '/👤 Информация о пользователе'}, {text: '/📕Addbooks'}]
        ],
        "resize_keyboard" : true,
        "one_time_keyboard" : true,
        "remove_keyboard":true
    }
};

var optEmployee = {
  'reply_markup': {
      'keyboard' : [
          [{text:'/🍔tolunch'}, {text:'/fromlunch🍔'}],
          [{text:'/⚔️stopwork'}, {text:'/👨🏼‍💻starkwork👩🏼‍💻'}]
      ]
  }
};

bot.onText(/\/switch/, function (msg, match) {
    if(msg.chat.id === 207925830){

    // if(msg.chat.id === 78923920){
        bot.sendMessage(msg.chat.id, "У вас новые кнопки", optionCeo);
    } else {
        bot.sendMessage(msg.chat.id,"У вас новые кнопки", optEmployee);
    }
});


// for sending book interactively
bot.on(mes, function (msg) {
    var data = ["text", "link"];
    var mes_id = 0;


    if(msg.text === '/📕Addbooks'){
        this.mes_id = msg.message_id;

        var opt = {
            'reply_to_message_id': this.mes_id
        };
        bot.sendMessage(msg.chat.id, "Введите название книги", opt);


    }

    if((msg.message_id - this.mes_id) === 2){

        bookData.push(msg.text);

        var opt = {
            'reply_to_message_id': (this.mes_id + 1),
            'reply_markup': {
                "keyboard":[
                    [{text: '⬅️ Назад'}]
                ],
                "resize_keyboard" : true,
                "one_time_keyboard" : true,
                "remove_keyboard":true
            }
        };
        bot.sendMessage(msg.chat.id, "Введите ссылку на книгу", opt);
    }

    var button = "⬅️ Назад";
    if((msg.message_id - this.mes_id) === 4){
        var optionCeo = {
            'reply_to_message_id': (this.mes_id + 1),
            'reply_markup': {
                "keyboard":[
                    [{text: '/👤 Информация о пользователе'}, {text: '/Addbooks'}]
                ],
                "resize_keyboard" : true,
                "one_time_keyboard" : true,
                "remove_keyboard":true
            }
        };

        if(msg.text === button ){
            bot.sendMessage(msg.chat.id, "Книга не отправлена",optionCeo);
            bookData = [];
        }
        else {
            var optionCeo = {
                //'reply_to_message_id': (this.mes_id + 1),
                'parse_mode':"Markdown",
                'reply_markup': {
                    "keyboard":[
                        [{text: '/👤 Информация о пользователе'}, {text: '/📕Addbooks'}]
                    ],
                    "resize_keyboard" : true,
                    "one_time_keyboard" : true,
                    "remove_keyboard":true
                }
            };

            bookData.push(msg.text);
            var book = Books({
                title: bookData[0],
                link: bookData[1],
                required: true
            });

            book.save(function (err, savedBook) {
               if(err) {
                   console.log(err);
               }
                var message = '['+savedBook.title +'](' + savedBook.link +')';
                bot.sendMessage(msg.chat.id, message, optionCeo);
                bookData = [];
            });
        }
    }

});

module.exports = botrouter;
