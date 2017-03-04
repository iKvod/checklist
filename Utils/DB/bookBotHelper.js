/**
 * Created by rafa on 04/03/2017.
 */
var Books = require('../../models/book');

function getBooks() {
  Books.find({})
    .exec(function (err, books) {
      return books;
      console.log(books);
    });
}

//current book that employee should read
function fetchCurrentBook(botId, messageToUser, callback){ // bookData title and link

  Books.find({})
    .exec(function(err, books){
      var len = books.length;
      if(err){
        console.log(err);
      }
      callback(books[len-1].link, books[len-1].title, botId, messageToUser);

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
  sendBookCheckout: sendBookCheckout
};