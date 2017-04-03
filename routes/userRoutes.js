var express = require('express');
var userrouter = express.Router();
var mongoose = require('mongoose');
var Users = require('../models/employee');
var emplBots = require('../models/employment');
var Psn = require('../models/positions');

userrouter.get('/', function(req, res, next){
    // Users.find({ disabled: false }, function(err, users){
    //     if(err) return next(err);
    //     res.send(users);
    // })
  Users.find( {disabled:false} )
    .populate({
      path: 'position',
      select: 'position'
    })
    .populate({
      path: 'department',
      select: 'department _id'
    })
    .exec(function (err, users){
      if(err) return next(err);
      res.send(users);
    });
});

userrouter.get('/fired', function (req, res, next) {
  Users.find({ disabled:true })
    .lean()
    .exec(function(err, users){
      if(err) return next(err);
      res.status(200).send(users);
    });
  // Users.find({}, function(err, users){
  //     if(err) return next(err);
  //     res.status(200).send(users);
  //   })
});

userrouter.get('/d', function (req, res, next) {

  emplBots.find({ registred: false }, function (err, empl) {
    if(err) {
      res.send({ message: 'Ошибка при получении бот ID сотрудника. Попробуйте позже!' });
      return;
    }
      res.send(empl);

    // if(empl.length === 0) {
    //   res.send(empl);
    //
    //   // res.send({ empl: null, message: "Попросите нового сотрудника зарегистрироваться в Телеграм боте"})
    // } else {
    //   res.send(empl);
    // }
  });
});

// Updating position and departments to null
userrouter.put('/update', function (req, res, next) {
  // var updatedUsers = [];

  changeToNull( function (err, updatedUsers) {
    if(err) {
      console.log(err);
      res.status(500).send(err);
      return;
    }
    // console.log(updatedUsers);
    res.send(updatedUsers);
  });


  function changeToNull(callback) {
    Users.find()
      .select('position department')
      .exec(function (err, users) {
        //console.log(users);
        if(err){
          callback(err, null);
          return;
        }
        var updatedUsers = [];
        for(var i = 0, len = users.length; i < len; i++){
          users[i].position = null;
          users[i].department = null;
          users[i].save(function (err, savedUser) {
            console.log(savedUser);
            if(err){
              callback(err, null);
              return;
            }
            updatedUsers.push(savedUser);
            // if (i === (users.length)){
            //   console.log(i);
            //   callback(null, updatedUsers);
            // }
          })
        }
        callback(null, updatedUsers);

      })
  }
});
// userrouter.get('/d', function (req, res, next) {
//
//   emplBots.findOne({ registred: false }, function (err, empl) {
//     if(err) {
//       res.send({ message: 'Ошибка при получении бот ID сотрудника. Попробуйте позже!' });
//       return;
//     }
//     if(empl) {
//       res.send({ botId: empl.botid, id: empl._id , counter: empl.counter});
//     } else {
//       res.send({ botId: null, message: "Попросите нового сотрудника зарегистрироваться в Телеграм боте"})
//     }
//   });
// });

var botHelper = require('../routes/helpers/TelegramBot/tmBotHelper');

userrouter.post('/',function(req, res, next) {
  var data = req.body;

  var user = new Users({
    firstname: data.firstname,
    lastname: data.lastname,
    department: data.department_id,
    position: data.position_id,
    botId: data.botId,
    employee_id: data.employee_id,
    work_time: data.work_time,
    salary_fixed: data.salary_fixed,
    bonus: data.bonus,
    phonenumber: data.phonenumber,
    email: data.email,
  });

  user.save(function(err, savedUser){
    if(err){
      console.log(err);
      if(err && err.code && (err.code === 11000)) {
        res.status(404).send({ message: "Сотрудник с таким Бот ID или ID уже существует!"});
        return
      } else {
        res.status(404).send({ message: 'Ошибка при сохранений данных сотрудника в базу. Попробуйте еще раз!'});
        return;
      }
    }
    savedUser.code = savedUser.generateCode();
    savedUser.save();
    res.status(302).send({message: 'Данные сотрудника ' + savedUser.getName() + ' добавлен в базу'});
    botHelper.sendMessTelegram(savedUser.botId, savedUser.firstname +", Ваш ID - " + savedUser.employee_id + " \n" +
      "ID Нужен для Checklista.\nПодробную информацию спрашивайте у менеджера или нажмите сюда => '/info' \n Желаем, плодотворной работы :)");
  });
});

//to delete employee from db permanantly
userrouter.delete('/perm/:id', function(req, res, next){
    var id = req.params.id;
    Users.remove({ _id: id }, function(err, deletedUser){
      console.log(deletedUser);
      // Psn.find({ }, function () {
      //
      // });

        if(err) {
          err.status(404);
          return next(err);
        }
        res.send(deletedUser.result);
    });

});


userrouter.get('/:id', function(req, res, next){
    Users.findById(req.params.id, function (err, user) {
        if(err) return next(err);
        res.send(user);
    });
});

userrouter.put('/:id', function(req, res, next){
    var data = req.body;
    console.log(data.admin);
     Users.findById(req.params.id, function (err, user) {

        if (err) {
            return next(err);
        }
       user.salary_fixed = data.salaryFixed || user.salary_fixed;
       user.firstname = data.firstname || user.firstname;
       user.lastname = data.lastname || user.lastname;
       user.department = data.department_id || user.department;
       user.position = data.position_id || user.position;
       user.botId = data.botId || user.botId;
       user.employee_id = data.employee_id || user.employee_id;
       user.work_time = data.work_time || user.work_time;
       user.salary_fixed = data.salary_fixed || user.salary_fixed;
       user.bonus = data.bonus || user.bonus;
       user.phonenumber =  data.phonenumber || user.phonenumber;
       user.email = data.email || user.email;
       user.disabled = data.disabled || user.disabled;
       user.admin = data.admin;

        user.save(function (err, savedUser) {
            if(err) {
                return next(err);
            }
            // console.log(savedUser);
            res.send({message: "Данные " + user.getName() + " изменены!"});
        });
    });

});

// unnesserary api
userrouter.delete('/:employee_id', function(req, res, next){
    Users.findById(req.params.employee_id, function(err, user){

        user.remove();

        user.save(function(err, resp){
            if(err) return next(err);
            console.log(resp);
            res.send(resp);
        });
    });
});


userrouter.put('/fire/:id', function (req, res, next) {
  console.log(req.params.id);
  Users.findOne({_id: req.params.id})
    .exec(function (err, user) {
      console.log(user);
            if(err){
                return next(err);
            }
      user.disabled = true;
      user.save(function (err, updatedUser) {
        if(err){
          console.log(err);
return;

        }
        console.log(updatedUser);
            res.status(200).send(updatedUser._id + " удален и данные помещены в архив!");
      });

    });
});

userrouter.put('/rehire/:id', function (req, res, next) {
  Users.findOne({_id: req.params.id})
    .exec(function (err, user) {
      if(err){
        return next(err);
      }
      user.disabled = false;
      user.save(function (err, updatedUser) {
        var message = {};
        message.message = "Данные " + updatedUser.getName() + " восстановлены из архива";
        res.status(200).send(message);
      });

    });
});

// to get user bot ID and chanche the registred field to true if registration is completed


userrouter.put('/bot/:id', function (req, res, next) {
  emplBots.findOne({botid: req.params.id}, function (err, empl) {
    if(err){
      res.send({ message: 'Попробуйте позже!'});
      return;
    }
    empl.registred = true;
    empl.save(function (err, savedData) {
      res.send( {message: 'Можете, дальше продолжить регистрацию!'});
    });
  });

});







module.exports = userrouter;