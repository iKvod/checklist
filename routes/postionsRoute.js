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

// adds position to db and to write to particular schema of deparment
router.post('/', function (req, res, next) {

  var pos = new Psn({
    position: req.body.position
  });

  pos.save(function (err, savedPos) {
    var id = savedPos._id;

    Dpts.findOne({ department: req.body.department }, function (err, department) {
      if(err){
        res.send(err);
        return;
      }

      department.positions.push(id);

      department.save(function (err, savedDep) {
       // var depId = savedDep._id;

        res.send({message: 'Должность ' + savedPos.position + ' добавлена в департамент ' + department.department});


        // Psn.findOne({ _id: id }, function (err, position) {
        //     position.departments.push(depId);
        //     position.save(function (err, savedPos) {
        //       if(err){
        //         res.send(err);
        //         return
        //       }
        //
        //       console.log(savedPos);
        //     })
        // })

      });
    });

  });
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

// when deleteing position inform User to give another position to existing user;
// Show him/her  existing user on current position
// and let him to change there on client side, when he/she tries to delete the particular position
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