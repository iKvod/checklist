'use strict';

var express = require('express');
var reportRoute = express.Router();
var Reports = require('../models/reporting');
var Users = require('../models/user');


reportRoute.get('/', function (req, res, next) {

    var usersReports = {

    };
    // var userReport = {
    //     username: String,
    //     reportminutes: [
    //         {
    //             date: null,
    //             minutes: null
    //         }
    //     ]
    // };




    Reports.find({})
        .populate('employee', ' firstname lastname' )
        .select('')
        .exec(function (err, report) {
            if(err){
                console.log(err);
                return next(err);
            }
            //console.log(report[0].calcTime());
            calculateMinutes(report, sendReportMinutes, usersReports, res);

        });

    // Users.find({})
    //     .populate('report')
    //     .select({'lastname':1,'firstname':1 ,'report': 1})
    //     .exec(function (err, users) {
    //         res.send(users);
    //     });
});

function calculateMinutes (report, callback, usersReports, res) {
    var reportMinutes = [];
    var name = '';

    for(var i = 0; i < report.length; i++){
        if(i === 0){
            name = report[i].employee.lastname + " " +report[i].employee.firstname;
            usersReports.name = name;
        }
        reportMinutes.push(report[i].calcTime());
    }
    callback(reportMinutes, usersReports, res);
};

function sendReportMinutes(reportMinutes, usersReports, res) {
    usersReports.reportminutes = reportMinutes;
    res.send(usersReports);
}


reportRoute.get('/:id', function (req, res, next) {
    Reports.findOne({_id: req.params.id})
        .populate('employee')
        .exec(function (err, report) {
            if(err){
                return next(err);
                console.log(err);
            }

            console.log(report.calcTime());
            console.log(report);
            res.send(report.calcTime());
        })
});

module.exports = reportRoute;
