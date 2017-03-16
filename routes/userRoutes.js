var express = require('express');
var userrouter = express.Router();
var mongoose = require('mongoose');
var Users = require('../models/employee');
var emplBots = require('../models/employment');




userrouter.get('/', function(req, res, next){
    // Users.find({disabled:false}, function(err, users){
    //     if(err) return next(err);
    //     res.send(users);
    // })
  Users.find({}, function(err, users){
    if(err) return next(err);
    res.send(users);
  })
});

userrouter.get('/fired', function (req, res, next) {
  Users.find({disabled:true}, function(err, users){
    if(err) return next(err);
    res.status(200).send(users);
  })
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

userrouter.post('/',function(req, res, next){
    var data = req.body;
    //console.log(data);

    var user = new Users({
      firstname: data.firstname,
      lastname: data.lastname,
      department: data.department,
      position: data.position,
      botId: data.botId,
      employee_id: data.employee_id,
      work_time: data.work_time,
      salary_fixed: data.salary_fixed,
      bonus: data.bonus,
      phonenumber: data.phonenumber,
      email: data.email
    });

    user.save(function(err, savedUser){
      if(err){
        //console.log(err);
        if(err && err.code && (err.code === 11000)) {
          res.status(404).send({ message: "Сотрудник с таким Бот ID уже существует!"});
          return
        } else {
          res.status(404).send({ message: 'Ошибка при сохранений данных сотрудника в базу. Попробуйте еще раз!'});
          return;
          //res.location('/error');
        }
      }

      // res.writeHead(302, {
      //   'Content-Type':'applocation/json'
      // });
      //res.location('/admin/employees');
      res.status(302).send({message: 'Данные сотрудника ' + savedUser.getName() + ' добавлен в базу'});
      botHelper.sendMessTelegram(savedUser.botId, savedUser.firstname +", Ваш ID - " + savedUser.employee_id + " \n" +
        "ID Нужен для Checklista.\nПодробную информацию спрашивайте у менеджера или нажмите сюда => '/info' \n Желаем, плодотворной работы :)");
    });

    // Users.create([req.body], function(err, user){
    //     if(err){
    //         return next(err);
    //         res.location('/error')
    //     }
    //
    //     res.writeHead(302, {
    //         'Content-Type':'application/json'
    //     });
    //
    //     res.location('/success');
    //
    //     res.send(user);
    // })
});

//to delete employee from db permanantly
userrouter.delete('/perm/:id', function(req, res, next){
    var id = req.params.id;
    Users.remove({ _id: id }, function(err, deletedUser){

        if(err) {
          err.status(404);
          console.log(err);
          return next(err);
        }
        res.send(deletedUser.result);
    });
    // Users.findById(id, function(err, user){
    //
    //   user.remove();
    //   user.save(function(err, deletedUser){
    //     if(err) {
    //       err.status(404);
    //       console.log(err);
    //       return next(err);
    //     }
    //     console.log(deletedUser);
    //     res.send(deletedUser);
    //   });
    // });

});


userrouter.get('/:id', function(req, res, next){
    Users.findById(req.params.id, function (err, user) {
        if(err) return next(err);
        res.send(user);
    });
});

userrouter.put('/:id', function(req, res, next){

     Users.findById(req.params.id, function (err, user) {

        if (err) {
            return next(err);
        }
        user.salary_fixed = req.body.salaryFixed;

        user.save(function (err) {
            if(err) {
                return next(err);
            }
            res.send({message: "Salary updated!"});
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
  Users.findOne({_id: req.params.id})
    .exec(function (err, user) {
            if(err){
                return next(err);
            }
      user.disabled = true;
      user.save(function (err, updatedUser) {
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