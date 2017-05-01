/**
 * Created by rafa on 06/03/2017.
 */
'use strict';

var express = require('express');
var router = express.Router();

var Books = require('../models/book');
var Users = require('../models/employee');


router.get('/', function (req, res, next) {
  Books.find({}, function (err, books) {
    res.send(books);
  })

});



router.get('/:id', function (req, res, next) {

});

// router.delete('/:id', function (req, res, next) {
//   var id -
//   Books.findOne()
// });




router.delete('/', function (req, res, next) {
  Books.remove({}, function (err, deletedBooks) {
   // console.log(deletedBooks);

    Users.find({})
      .exec(function (err, user) {

        deleteBooks(0, user, function () {
          res.send("Все книги удалены");
        });
      })

  });
});

function deleteBooks(i, user, callback) {
  if(i < user.length){
    user[i].book = [];
    user[i].save(function (err, deletedBook) {
      console.log(i+1);
      console.log(deletedBook);
    });
    deleteBooks(i+1, user, callback)

  } else {
    callback();
  }
}

module.exports = router;