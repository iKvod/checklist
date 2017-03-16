/**
 * Created by rafa on 15/03/2017.
 */


var TelegramBot = require('node-telegram-bot-api');

var config = require('../../../config');
var token = config.token;
var bot = new TelegramBot(token);


function sendMessTelegram(userBotId, message) {
  bot.sendMessage(userBotId, message);
}


module.exports = {
  sendMessTelegram: sendMessTelegram
}










