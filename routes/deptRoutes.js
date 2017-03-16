/**
 * Created by rafa on 11/03/2017.
 */

var express = require('express');
var router = express.Router();
var Depts = require('../models/departments');

router.get('/', function (req, res, next) {
  Depts.find({}, function (err, depts) {
    if(err){
      return next(err);
    }
    res.send(depts);
  })

});

router.post('/', function (req, res, next) {
  var data = req.body;
  var dept = new Depts({});
  if(data.message === 'pos'){
    dept.positions.push(data.pos);
  }else if(data.message === 'dept'){
    dept.departments.push(data.dept);
  }
  dept.save(function (err, savedDept) {
    if(err){
      return next(err);
    }
    console.log(savedDept);
    res.send(savedDept);
  });

});

router.delete('/', function(req, res, next){
  Depts.remove({}, function (err, data) {
    res.send(data);
  })

});

//used in settings to create a new department or position
// req.body data has a message obj with jeys pos or depts
router.put('/', function (req, res, next) {
  var data = req.body;
  console.log(data);

  Depts.findOne({})
    .exec(function (err, dept) {
      if(err){
        return next(err)
      }
      if(data.message === 'pos'){
        dept.positions.push(data.pos);
      }else if(data.message === 'dept'){
        dept.departments.push(data.dept);
      }

      dept.save(function (err, savedDept) {
        if(err){
          return next(err);
        }
        res.send(savedDept);
      });
    })
});


module.exports = router;