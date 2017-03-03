var express = require('express');
var userrouter = express.Router();
var mongoose = require('mongoose');
var Users = require('../models/user');



userrouter.get('/', function(req, res, next){
    Users.find({}, function(err, users){
        if(err) return next(err);
        res.send(users);
    })
});

userrouter.post('/',function(req, res, next){
    Users.create([req.body], function(err, user){
        if(err){
            return next(err);
            res.location('/error')
        }

        res.writeHead(302, {
            'Content-Type':'application/json'
        });

        res.location('/success');

        res.send(user);
    })
});


userrouter.delete('/', function(req, res, next){
    console.log("You may only delete only per user!");
});


userrouter.get('/:userId', function(req, res, next){
    Users.findById(req.params.userId, function (err, user) {
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


module.exports = userrouter;