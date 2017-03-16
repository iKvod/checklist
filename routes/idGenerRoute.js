/**
 * Created by rafa on 11/03/2017.
 */
/**
 * Created by rafa on 11/03/2017.
 */

var express = require('express');
var router = express.Router();
var Depts = require('../models/departments');
var idGntr = require('../Utils/idGenerator');


router.get('/idgen', function (req, res, next) {

  var dept = null;
  idGntr.generateId(dept, function (err, id) {
    if(err){
      res.status(404).send(err);
      return;
      //return next(err);
    }
    console.log(id);
    res.send(id);
  });
});

router.post('/idgen', function (req, res, next) {

  idGntr.generateId(req.body.dept, function (err, id) {
    if(err){
      res.status(404).send(err);
      return;
      //return next(err);
    }
    console.log(id);
    res.send(id);
  });
});

router.get('/code', function (err, message) {

});

module.exports = router;