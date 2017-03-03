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
        .select({'employee_id':1, 'lastname':1,'firstname':1 , 'salary_fixed':1, 'report': 1})
        .exec(function (err, users) {
            if (err) {
                return next(err);
            }
           // res.send(users);
            timeCalculator.calculateMinutes(users, res, function (userReport, res) {
               // var salaryReport = ['ss'];
               // var fullSalaryReport = [];
               // var obj = {
               //      userReport: userReport,
               //      salaryReport: []
               // };

                sendSalaryReport(userReport, res, function (res, usersSalaryReport) {
                   //console.log(salaryReport);
                   // res.send(userReport);
                   res.send(usersSalaryReport);
                });

            });
        });
});



function sendSalaryReport (userReport, res, callback){

    var usersSalaryReport = [];
    var salaryReport = [];
    var employeeInfo = {
        employee_id:null,
        name : null,
        salaryFixed: null,
        totalSalary: null,
        totalMonthHours: null,
        salaryReports: []
    };

    var salary = {
        salaryPerDay:  null,
        salaryDetails: []
    };

    for(var i = 0, len = userReport.length; i < len; ++i) {
        employeeInfo.employee_id = userReport[i].employee_id;
        employeeInfo.name = userReport[i].username;
        employeeInfo.salaryFixed = userReport[i].salaryfixed;

        for(var j = 0, len1 = userReport[i].reportminutes.length; j < len1; j++) {

            salary.salaryPerDay = salaryCalculator.salaryPerDay(userReport[i].reportminutes[j].report.beginWorkDay, {}, userReport[i].salaryfixed, salaryCalculator.calcSalaryFixedPerDay, userReport[i].reportminutes[j].report.totalTimeInMinutes, null);
            salary.salaryDetails = userReport[i].reportminutes[j];
            salaryReport.push(salary);
            employeeInfo.totalMonthHours += salary.salaryDetails.report.fullTimeHours;
            employeeInfo.totalSalary += salary.salaryPerDay;
            // console.log(salary.salaryDetails);
            salary = {};
            //console.log(employeeInfo.totalSalary);
            //console.log(salary.salaryPerDay);
        }
        //console.log(employeeInfo.totalSalary);

        employeeInfo.salaryReports = salaryReport;
        usersSalaryReport.push(employeeInfo);
        employeeInfo = {}
        salaryReport = [];
    }
    callback(res, usersSalaryReport);
}

salaryRoute.get('/:id', function (req, res, next) {
    Users.find({ _id: req.params.id})
        .populate('report')
        .select({'employee_id':1, 'lastname':1,'firstname':1 , 'salary_fixed':1, 'report': 1})
        .exec(function (err, users) {
            if (err) {
                return next(err);
            }
            // res.send(users);
            timeCalculator.calculateMinutes(users, res, function (userReport, res) {
                var salaryReport = ['ss'];
                var fullSalaryReport = [];
                var obj = {
                    userReport: userReport,
                    salaryReport: []
                };

                sendSalaryReport(userReport, res, function (res, usersSalaryReport) {
                    //console.log(salaryReport);
                    // res.send(userReport);
                    res.status(200).send(usersSalaryReport);
                });
                // res.send(users)

            });
        });



    // Reports.findOne({_id: req.params.id})
    //     .populate('employee')
    //     .exec(function (err, report) {
    //         if(err){
    //             return next(err);
    //             console.log(err);
    //         }
    //         res.send(report.calcTimeCorrectly());
    //     })
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