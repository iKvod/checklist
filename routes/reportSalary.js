'use strict';

var express = require('express');
var salaryRoute = express.Router();
var Reports = require('../models/reporting');
var Users = require('../models/user');
var timeCalculator = require('./helpers/TimeCalcReportings/calcMinutes');
var salaryCalculator = require('./helpers/SalaryReportingHelpers/reportSalary');

salaryRoute.get('/', function (req, res, next) {
    Users.find({})
        .populate('report')
        .select({'lastname':1,'firstname':1 , 'salary_fixed':1, 'report': 1})
        .exec(function (err, users) {
            if (err) {
                return next(err);
            }
           // res.send(users);
            timeCalculator.calculateMinutes(users, res, function (userReport, res) {
               var salaryReport = [];
               var fullSalaryReport = [];
               var obj = {
                    userReport: userReport,
                    salaryReport: []
               };

                //console.log(users.salary_fixed);
               res.send(userReport);

               for(var i = 0, len = userReport.length; i < len; ++i){

                   for(var j = 0, len1 = userReport[i].reportminutes.length; j < len1; j++){

                        var salaryPerDay = salaryCalculator.salaryPerDay(userReport[i].reportminutes[j].report.beginWorkDay, {}, userReport[i].salaryfixed, salaryCalculator.calcSalaryFixedPerDay, userReport[i].reportminutes[j].report.totalTimeInMinutes, null);
                        salaryReport.push(salaryPerDay);
                        //console.log(salaryPerDay);
                   }
                   console.log(salaryReport);
                   salaryReport = [];
               }

               //console.log(salaryReport);

            });
        });
});

salaryRoute.get('/:id', function (req, res, next) {
    Reports.findOne({_id: req.params.id})
        .populate('employee')
        .exec(function (err, report) {
            if(err){
                return next(err);
                console.log(err);
            }
            res.send(report.calcTime());
        })
});


salaryRoute.get('/employee/:id', function (req, res, next) {

    Users.findById(req.params.id)
        .select({ 'salary_fixed':1 })
        .exec(function (err, user) {


            if (err) {
                return next(err);
            }
            res.send({user:user, name: user.getName()});
        });
});

salaryRoute.put('/employee/:id', function (req, res, next) {

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



module.exports = salaryRoute;