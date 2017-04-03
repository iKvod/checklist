/**
 * Created by rafa on 13/03/2017.
 */
/**
 * Created by rafa on 13/03/2017.
 */

var express = require('express');
var router = express.Router();
var Dpts = require('../models/departments');

router.get('/', function(req, res, next){
  Dpts.find({}, function (err, dpts) {
    if(err)
    {
      return next(err);
    }
    // console.log(dpts);
    res.status(200).send(dpts);
  })
});

router.post('/', function (req, res, next) {
  console.log(req.body);
  var dep = new Dpts({});
  dep.department = req.body.dept;
  dep.save(function (err, savedDept) {
    if(err){
      return next(err);
    }
    //console.log(savedDept);
    res.send({ message: "Департамент " + savedDept.department + " добавлен в базу!"});
  })
});


router.get('/:id', function (req, res, next) {
  Dpts.findOne({ _id: req.params.id })
    .select('department')
    .lean()
    .exec(function (err, dpt) {
      if(err)
      {
        return next(err);
      }
      res.status(201).send(dpt);
    });
});

// To get departments with positions
router.get('/position/:id', function (req, res, next) {
  Dpts.findOne({ _id: req.params.id })
    .populate({
      path: 'positions',
      select: 'position'
    })
    .lean()
    .exec(function (err, dpt) {
      if(err)
      {
        console.log(err);
        res.send(err);
        return ;
      }
      console.log(dpt)
      res.status(201).send(dpt);
    });
});

router.put('/:id', function (req, res, next) {
  Dpts.findOne({_id: req.params.id}, function (err, dpt) {
    if(err)
    {
      return next(err);
    }
    dpt.department = req.body.dept;
    dpt.save(function(err, savedDpt){
      res.status(201).send({ message: 'Название отдела изменен!' });
    });
  })
});

router.delete('/:id', function (req, res, next) {
  Dpts.remove({_id: req.params.id}, function (err, info) {
    if(err){
      return next(err);
    }
    res.status(200).send({message: "Департамент удален с базы! Сделайте очистку)"});
  });
});

module.exports = router;