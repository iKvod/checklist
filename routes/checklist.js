'use strict';

var express = require('express');
var checklist = express.Router();
var mongoose = require('mongoose');
var fs = require('fs');

var TelegramBot = require('node-telegram-bot-api');
var token = "324830524:AAF_QWatxxdsHbxrC2cB82jxKj8tZmd6wWE";
var bot = new TelegramBot(token);

var Users = require('../models/user');
var Reports = require('../models/reporting')


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

checklist.post('/checkin', function(req, res, next){
    //console.log(req.body);
    var id = req.body.employee_id;

    //generating index for code property of Employee schema
    //to get some random code, which send to telegram got
    var index = generateIndex(8,0);

    Users.find({
        employee_id: id
    })
        .select({checked: 1, code:1, botId:1})
        .exec(function (err, data) {
            if(err){
                console.log(err);
                res.send(err);
                return;
            }
            //console.log(data[0].code[index]);
            console.log(data);
            bot.sendMessage(data[0].botId, data[0].code[index]);
            res.send(data);
            //console.log(data);
        });
});

checklist.get('/checklist', function (req, res, next) {
    console.log('/api/cheklist/checklist');
    var id = req.body.employee_id;
    Users.find({
        // employee_id: id
    })
        .select({checked: 1, code:1, botId:1})
        .exec(function (err, data) {
            if(err){
                console.log(err);
                res.send(err);
                return;
            }
            //console.log(data[0].code[index]);
            console.log(data);
            res.send(data);
            //console.log(data);
        });

    //res.send("OK");
});
checklist.get('/:id', function (req, res, next) {
    console.log('/api/cheklist/checklist');
    var id = req.body.employee_id;
    Users.find({
        // employee_id: id
    })
        .select({checked: 1, code:1, botId:1})
        .exec(function (err, data) {
            if(err){
                console.log(err);
                res.send(err);
                return;
            }
            //console.log(data[0].code[index]);
            console.log(data);
            var index = generateIndex(8,0);
            bot.sendMessage(data[0].botId, data[0].code[index]);
            res.send(data);
            //console.log(data);
        });
});

checklist.post('/code', function(req, res,  next){
    //if user checked it will be saved as checkin
    //otherwise checked as checkout
    console.log(req.body);
    if(!req.body.checked){
        var report = new Reports();
        console.log("User cheked");
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

checklist.post('/checkout', function (req, res, next) {
    console.log("Code is: " + req.body.code);
    var report = new Reports();
    var checkout = new Date();

    //console.log(checkout);
    // report.check.push(checkout);
    //
    //
    // report.save(function (err, report) {
    //    if (err) {
    //        console.log(err);
    //        return;
    //    }
    //    console.log(report);
    // });

    res.send('OK');
});

checklist.post('/image', function(req,res, next){

});

checklist.post('/upload', function (req, res, next) {
    var b64Data = req.body.data.split(',')[1];
    var buffer = new Buffer(b64Data, 'base64');
    fs.writeFile('./' + req.body.name, buffer, function(e){
        if(e) console.log(e);
    });
});


module.exports = checklist;

