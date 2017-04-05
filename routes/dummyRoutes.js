/**
 * Created by rafa on 03/04/2017.
 */
/**
 * Created by rafa on 13/03/2017.
 */
/**
 * Created by rafa on 13/03/2017.
 */

var express = require('express');
var router = express.Router();
var Users = require('../models/employee');

router.get('/', function(req, res, next){


});

router.post('/fire', function (req, res, next) {
  Users.find({})
    .exec(function (err, users) {
      if(err){
        res.status(404).send(err);
        return;
      }

      for(var i = 0, len = users.length; i < len; i++){
          users[i].disabled = false;
          users[i].save(function (err, saved) {

            if(i === len - 1) {
              res.send('Disabled');
            }
          })
      }
    })
});

router.delete('/', function (req, res, next) {

});


router.get('/:id', function (req, res, next) {

});

router.put('/:id', function (req, res, next) {

});

router.delete('/:id', function (req, res, next) {

});

module.exports = router;