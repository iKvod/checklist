/**
 * Created by rafa on 13/03/2017.
 */

var express = require('express');
var router = express.Router();
var Psn = require('../models/positions');
var Dpts = require('../models/departments');

router.get('/', function(req, res, next){
  Psn.find({}, function (err, psns) {
    if(err)
    {
      return next(err);
    }
    res.status(200).send(psns);
  })
});

router.post('/', function (req, res, next) {
  var psn = new Psn({});
  psn.position = req.body.position;
  psn.save(function (err, savedPsn) {
    if(err){
      return next(err);
    }
    res.send({message: 'Должность добавлена в базу'});
  })

});

router.delete('/', function (req, res, next) {

});


router.get('/:id', function (req, res, next) {
  Psn.findOne({_id: req.params.id}, function(err, psns){
    if(err){
      return next(err);
    }

    res.status(200).send(psns);
  });
});

router.put('/:id', function (req, res, next) {
  console.log(req.body);
  Psn.findOne({_id: req.params.id}, function (err, psn) {
    if(err)
    {
      return next(err);
    }

    psn.position = req.body.position;
    psn.save(function(err, savedPsn){
      res.status(201).send({ message: 'Название должности изменен!' });
    });
  })

});

router.delete('/:id', function (req, res, next) {
  Psn.remove({_id : req.params.id}, function (err, info) {
    if(err){
      return next(err);
    }
    res.send({ message: "Должность удалена c базы!" });
  });

});

router.put('/dpt/:id', function (req, res, next) {
  Dpts.findOne({_id: req.params.id}, function (err, dpt) {
    dpt.positions.push(req.body.pos_id);
    dpt.save(function (err, savedDpt) {
      if(err){
        return next(err);
      }
      res.send({ message: 'Должность добавлена в отдел' + dpt.department });
    });
  })
});



module.exports = router;