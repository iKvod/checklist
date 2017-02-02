'use strict';

var express = require('express');
var botrouter = express.Router();
var upload = require('multer')();
var fs = require('fs');

//Models
var User = require('../models/user');


var TelegramBot = require('node-telegram-bot-api');
var token = "324830524:AAF_QWatxxdsHbxrC2cB82jxKj8tZmd6wWE";
//var bot = new TelegramBot(token, {polling: true});

// var options = {
//     webHook: {
//         port: 443,
//         key: `${__dirname}/cert/key.pem`,
//         cert: `${__dirname}/cert/crt.pem`
//     }
// };
//
// var url = 'https://checklist.automato.me>';
// var bot = new TelegramBot(token, options);
//
//
// bot.setWebHook(`${url}/bot${TOKEN}`, {
//     certificate: options.webHook.cert,
// });

var options = {
    webHook: {
        port: 80,
        key: `${__dirname}/cert/key.pem`,
        cert: `${__dirname}/cert/cert.pem`
    }
};

//var url = 'https://checklist.automato.me>';
var url = 'http://188.166.182.2/';
var bot = new TelegramBot(token, options);


bot.setWebHook(`${url}/bot${token}`, {
    certificate: options.webHook.cert,
});


/*
*
* DIRECTLY FROM TELEGRAM BOT
*
* */

//employee will be registred when he start using @automatochecklistbot
bot.onText(/\/start/, function(msg, match){
    var userId = msg.from.username;
    var chatId = msg.chat.id;
    // var userData = {
    //     tg_id: msg.from.username,
    //     tg_firstname: msg.from.first_name,
    //     tg_lastname: msg.from.last_name,
    //     registered_at:msg.date
    // };
    //console.log(msg);
    var code = generateCode();
    var user = new User({
        employee_id:'16it07',
        botId: msg.from.id,
        username:msg.from.username,
        firstname:msg.from.first_name,
        lastname:msg.from.last_name,
        code: code
    });
    //console.log(msg)

    user.save(function(err, user){
        if(err) {
            console.log("Ошибка при сохранений: " + err.errmsg);
            bot.sendMessage(chatId, "Sorry can't register you!");
            return ;
        }
        console.log(user);
        bot.sendMessage(chatId, 'You are saved to database, Dude!' + " and you're id is " + user.employee_id);
    });
});

bot.onText(/\/start@register (.+)/, function(msg, mathch){

});



//
bot.onText(/\/addemployee (.+)/, function (msg, match) {
    console.log(msg);
    var chatId = msg.chat.id;
    var resp = match[1]; //

    // send some responce
    bot.sendMessage(chatId, resp + "This is your");
});



/*
 *TELEGRAM BOT commands for reporting
 * /sendbook@touser
 * /sendbook [users id] [link to book | Name of book ]
 * /sendbook@toserver
 * */

// Get user info: will show telegramm ID
// teklegram id will be provided to send by it the link to book
bot.onText(/\/sendbook@touser/, function (msg, match) {
    User.find({})
        .select({botId:1, firstname:1})
        .exec(function (err, data) {
            console.log(data);
            var text = '';
            var it = 0;
            data.forEach(function(user){
                it++;
                console.log(user.botId);
                text += it + ") ID telegram:"+ user.botId + " name: " + user.firstname + " " + "\n";
            });

            bot.sendMessage(msg.chat.id, text);
        })
});


//sendbook [id] [linkToBook]
bot.onText(/\/sendbook (.+) (.+)/, function(msg, mathch){
    console.log(mathch[1]);
    console.log("_____________")
    console.log(mathch[2]);

    // var desc = 'Без названия';
    // if(mathch[3]){
    //     desc = mathch[3];
    // }
        var opt = {
                'parse_mode':"Markdown"
        };

        bot.sendMessage(mathch[1], '[КНИГА]('+ mathch[2] +')', opt)
        .then(function (resp) {
            console.log(resp)
        }, function (err) {
            console.log(err);
        });
});

bot.onText(/\/sendbook@toserver (.+)/, function (msg, mathch) {

});

bot.onText(/\/addbook (.+) (.+)/, function (msg, match) {

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
bot.onText(/\/tolunch/, function(msg, match){
    var chatId = msg.chat.id;
    var name = msg.chat.user_name;

    bot.sendMessage(chatId, name + ": I'm going to have a lunch!");
});

bot.onText(/\/fromlunch/, function(msg, match){
    var chatId = msg.chat.id;
    var name = msg.chat.user_name;

    bot.sendMessage(chatId, name + ': I came from lunch');
});

bot.onText(/\/stopwork/, function(msg, match){
    var chatId = msg.chat.id;
    var name = msg.chat.user_name;

    bot.sendMessage(chatId, name +  ': Stop working');
});

bot.onText(/\/starkwork/, function(msg, match){
    var chatId = msg.chat.id;
    var name = msg.chat.user_name;

    bot.sendMessage(chatId, name + ': Start working');
});

// bot.onText(/(.+)  /, function(msg, match){
//     console.log(msg.text + " from " + msg.chat.username ) ;
// });

// bot.onText(/\/key/,function(msg, match){
//     var opt = {
//         'parse_mode':"Markdown",
//         'reply_markup': {
//                 "keyboard":[
//                     [{text: 'YES'}],
//                     [{text: 'NO'}]
//                 ]
//
//         }
//     }
//
//     bot.sendMessage(msg.chat.id, "*Some* message here", opt);
//
// });

// bot.onText(/\/(.+)/, function(msg, match){
//     var chatId = msg.chat.id;
//     bot.sendMessage(chatId, "Can't understand!");
// });


bot.on('image',function(msg){
    var chatId = msg.chat.id;
    bot.sendMessage(chatId, "Recieved Your message");
    console.log(msg);
});

/*
* API checklist
* from web client
* */


// random id generator. used when employee starts using @automatochecklistbot
function generateId(options){
    var department = ['IT', 'MM', 'INT'];
    var year = ['14', '15', '16'];
    var currentYear = new Date();
    var counter = Math.floor(Math.random() * (100 - 9) + 100);



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


botrouter.get('/books', function(req, res, next){

});

botrouter.post('/book', function(req, res, next){
    bot.sendMessage(chatId, "SOME MESSAGE");
});

//gathering snapchot image and sending it to bot
botrouter.post('/image', function (req, res, next) {
    var time = new Date();

    var b64Data = req.body.image;
    var buffer = new Buffer(b64Data, 'base64');
    var report = time + "\n"+req.body.report;
   // bot.sendMessage(207925830,'_'+report+'_', {'parse_mode':"Markdown"});
    //var url = "https://www.google.kz/imgres?imgurl=https://lh5.googleusercontent.com/-89xTT1Ctbrk/AAAAAAAAAAI/AAAAAAAABcc/Kg0vilTzpKI/s0-c-k-no-ns/photo.jpg&imgrefurl=https://plus.google.com/u/0/114461178896543099856&h=349&w=349&tbnid=xioshf3NC0EdIM:&vet=1&tbnh=186&tbnw=186&docid=Crf5bkJhI8aTfM&itg=1&usg=__TtEAsURjtwX5OnkvlM3Ngw4WYsg=&sa=X&ved=0ahUKEwjn4KbdhO_RAhUFS5oKHW3BCu8Q_B0IczAK&ei=CueRWOezJYWW6QTtgqv4Dg#h=349&imgrc=xioshf3NC0EdIM:&tbnh=186&tbnw=186&vet=1&w=349";
    var opt = {
        "caption":report,
        'reply_markup': {
                    "keyboard":[
                        [{text: '👍'}],
                        [{text: '👎'}]
                    ],
                    "resize_keyboard" : true,
                    "one_time_keyboard" : true
            }
    };

    bot.sendPhoto(207925830, buffer, opt);
    console.log('👎');
    fs.writeFile('./' + 'ajfklj.jpeg', buffer, function(e){
        if(e) console.log(e);
    });

    // var opt = {
    //     'parse_mode':"Markdown",
    //     'reply_markup': {
    //             "keyboard":[
    //                 [{text: 'YES'}],
    //                 [{text: 'NO'}]
    //             ],
    //             "resize_keyboard" : true,
    //             "one_time_keyboard" : true
    //     }
    // };
    //
    // bot.sendMessage(207925830, '_Hello_', opt)

    /*
    * For sending links for books
    * */
    // var opt = {
    //     'parse_mode':"Markdown",
    //     'inline_markup': {
    //         "inline_button":[
    //             [{text: 'YES', url: "google.com"}],
    //             [{text: 'NO'}]
    //         ]
    //     }
    // };
    //
    // bot.sendMessage(207925830, '[Book](http://www.vk.com)', opt)
    //     .then(function (resp) {
    //         console.log(resp)
    //     }, function (err) {
    //         console.log(err);
    //     });

    res.send("OK");
});


module.exports = botrouter;
