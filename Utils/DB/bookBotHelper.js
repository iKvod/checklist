/**
 * Created by rafa on 04/03/2017.
 */
var Books = require('../../models/book');
var User = require('../../models/employee');
var TelegramBot = require('node-telegram-bot-api');
var config = require('../../config');
var token = config.token;
var bot = new TelegramBot(token);


function getBooks(callback) {
  Books.find( {} )
    .select({ title:1, link:1 })
    .exec(function (err, books) {
      if(err){
        console.log(err);
        return;
      }
      callback(books);
    });
}

//current book for employees
function getBookEmployees(callback) {
  User.find({ disabled: false } , 'firstname book')
    .exec(function (err, data) {

      if(err) console.log(err);
      var str = '';
      if(data.length != 0){
        getBookName(0, data, str, function (str) {
          callback(str);
        });
      } else  {
        callback('Нет пользователей');
      }
  })
}


function getBookName(i, data, str, callback) {
  var bookId = null;
  var len = data.length;

  if(i < len){

    bookId = data[i].book[0];

    if(bookId){
      Books.findOne({_id: bookId})
        .exec(function (err, book) {
          if(err)
          {
            console.log(err);
            return;
          }
          //console.log("klasjflka");

          if(book){
            str += (i + 1) + " "  + data[i].firstname + ' - ' + (book.title ? book.title : "такой книги нет!" ) + "\n";
          } else {
            str = str + "у него такая книга не сущестует";
          }

          getBookName(i+1, data, str, callback);
        });

    } else {
      str += (i + 1) + " " + data[i].firstname + " Все прочитал\n";
      getBookName(i+1, data, str, callback);
    }

  } else {
      callback(str);
  }

}



//current book that employee should read
function fetchCurrentBook(botId, messageToUser, callback){ // bookData title and link

  Books.find({})
    .exec(function(err, books){
      var len = books.length;
      if(err){
        res.status.send({message: 'Ошибка при отравке текущей книги сотруднику!'});
        console.log(err);
      }
      if(books.length <= 0){

      } else  {
        callback(books[len-1].link, books[len-1].title, botId, messageToUser);
      }

    });
}

function sendBookCheckout(link, title, botId, messageToUser) {

  var opt = {
    'parse_mode':"Markdown"
  };
  bot.sendMessage(botId, messageToUser);
  bot.sendMessage(botId, "["+"Текущая книга которую Вы должны прочитать:\n"+title+"](" + link + ")", opt);
}

module.exports = {
  getBooks: getBooks,
  fetchCurrentBook: fetchCurrentBook,
  sendBookCheckout: sendBookCheckout,
  getBookEmployees: getBookEmployees
};