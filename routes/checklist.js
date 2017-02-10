'use strict';

var express = require('express');
var checklist = express.Router();
var mongoose = require('mongoose');
var fs = require('fs');

var TelegramBot = require('node-telegram-bot-api');
var token = "324830524:AAF_QWatxxdsHbxrC2cB82jxKj8tZmd6wWE";
var bot = new TelegramBot(token);

var Users = require('../models/user');
var Reports = require('../models/reporting');



function generateIndex(max, min) {
    var index = Math.floor(Math.random() * (max - min) + min);
    return index;
}

function generateCode (){
    var code = [];

    var index = generateIndex(9, 8);

    for(var i = 0; i < index; ++i){
        var number = Math.floor(Math.random() * (9000 - 1000) + 1000);
        code[i] = number;
        // console.log(code[i] = number);
    }
    return code;
}

//user sends employee_id to server
// for reports

checklist.get('/checkin/:id', function (req, res, next) {
    Users.find({_id:req.params.id})
        .populate('report')
        .exec(function (err, data) {
           if (err) console.log(err)
            console.log(data);
           res.send(data);
        });
});

checklist.post('/checkin/:id', function(req, res, next){
    console.log(req.body);
    console.log(req.params.id);

    var id = req.params.id;

    var report = new Reports({
        check_in: new Date(),
        employee: id
    });

    report.save(function(err, data){
       if(err) {console.log(err)}

        Users.findById(id, function (err, user) {
           if(err) {console.log(err); return}

           if(user){

            user.report.push(data._id);
            user.checked = true;

            user.save(function(err, savedUser){
                console.log(savedUser);
                res.send(savedUser);
            });

           } else {
               res.status(400).send({message: "Пользователь не найден!"});
           }

        });
    });

    // Users.findById(id, function (err, user) {
    //    if(err){console.log(err); return next(err);}
    //
    //    user.checked = req.body.checked;
    //     //console.log(user);
    //
    //     user.save(function (err, data) {
    //        if(err) {res.send(err); return}
    //         var report = new Reports({
    //             employee: data._id,
    //             check_in: data.updated,
    //             report: "Hello, this is my first record!"
    //         });
    //
    //        report.save(function (err, report) {
    //            if (err){ console.log("Error when saveing report time"); return}
    //            console.log(report);
    //        });
    //        res.send(data);
    //    });
    // });
    // // Users.update({employee_id:req.params.id}, { $set: { checked: req.body.checked }}, function (err, user) {
    // //     console.log(user);
    // //     res.send(user);
    // //     // user.checked = req.body.checked;
    // //     // user.save(function (err, updatedUser) {
    // //     //     res.send(updatedUser);
    // //     // })
    // // });

});

checklist.get('/checkout/:id', function (req, res, next) {
    var id = req.params.id;
    Users.findById(id)
        .populate('report')
        .select({})
        .exec(function (err, data) {
            if(err) { console.log(err); return }
            var len = data.report.length;
            var report = data.report[len - 1];
            //console.log(data.report[len - 1]);
            res.send(data);
        });
});


checklist.put('/checkout/:id', function (req, res, next) {
    //console.log(req.body);
    Users.findById(req.params.id, function(err, data){
        if (err) console.log(err);
        var len = data.report.length - 1;
        data.checked = false;

        data.save(function(err, savedData){
            if(err) return next(err);

            var lastReportId = savedData.report[len];

            Reports.findById(lastReportId, function (err, report) {
               if(err) return next(err);
               //console.log(report);

               report.check_out = new Date();
               report.report = req.body.report;
               //
               report.save(function (err, savedReport) {
                   //console.log(savedReport);
                    res.send(savedReport);
               });
            });
        });

    });
});

checklist.get('/report', function (req, res, next) {
    Users.find({})
        .populate('report')
        .select({})
        .exec(function (err, data) {
            if(err) { console.log(err); return }
            res.send(data);
        });
});

// checklist.get('/checklist', function (req, res, next) {
//     console.log('/api/cheklist/checklist');
//     var id = req.body.employee_id;
//     Users.find({
//         // employee_id: id
//     })
//         .select({checked: 1, code:1, botId:1})
//         .exec(function (err, data) {
//             if(err){
//                 console.log(err);
//                 res.send(err);
//                 return;
//             }
//             //console.log(data[0].code[index]);
//             console.log(data);
//             res.send(data);
//             //console.log(data);
//         });
//
//     //res.send("OK");
// });


// for see if user checked in system
checklist.get('/:id', function (req, res, next) {
    // console.log(req.params);
    // console.log('/api/cheklist/:id');
    var id = req.params.id;
    Users.findOne({
         employee_id: id
    })
        .select({checked: 1, firstname:1, lastname:1, code:1, botId:1, employee_id:1, report:1})
        .exec(function (err, data) {
            //console.log(data);
            if(err){
                console.log(err);
                res.send(err);
                return;
            }
            if(data) {
                var index = generateIndex(8,0);
                bot.sendMessage(data.botId, data.code[index]);
                res.send(data);
            } else {
                res.status(404).send("Пользователь не найден!")
            }
        });
});


//for checking if code typed by user is valid
checklist.post('/code', function(req, res,  next){
    //if user checked it will be saved as checkin
    //otherwise checked as checkout
    console.log(req.body);
    if(!req.body.checked){
        var report = new Reports();
        console.log("User checked");
        Users.find({
            botId: req.body.botId
        })
        .select({ code:1 })
        .exec(function (err, data) {
            if(err) {
                console.log(err);
                res.send(err);
                return;
            }
            //check if the code in users code prototype
            console.log(data);
            if(req.body.code) {
                for(var i = 0; i < 2; ++i){
                    if(data[i] === req.body.code) {
                        console.log(data);
                        res.send(data);
                        return;
                    }
                }
            } else {
                res.send("CodeIsnotprovided");
            }

            //bot.sendMessage(data[0].botId, data[0].code[index]);
        });

    } else {
        console.log("not checked");
        res.send("ok");
    }
    res.send("ok")
});


checklist.post('/upload/:id', function (req, res, next) {
    var b64Data = req.body.data.split(',')[1];
    var buffer = new Buffer(b64Data, 'base64');
    fs.writeFile('./' + req.body.name, buffer, function(e){
        if(e) console.log(e);
    });
});


module.exports = checklist;

