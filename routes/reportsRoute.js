'use strict';

var express = require('express');
var reportRoute = express.Router();
var Reports = require('../models/reporting');
var Users = require('../models/user');


reportRoute.get('/', function (req, res, next) {
    // Reports.find({})
    //     .populate('employee', ' firstname lastname' )
    //     .select('')
    //     .exec(function (err, report) {
    //         if(err){
    //             console.log(err);
    //             return next(err);
    //         }
    //         res.send(report);
    //         //console.log(report[0].calcTime());
    //         //calculateMinutes(report, sendReportMinutes, usersReports, res);
    //
    //     });

    Users.find({})
        .populate('report')
        .select({'lastname':1,'firstname':1 ,'report': 1})
        .exec(function (err, users) {
            if (err) {
                return next(err);
            }
            calculateMinutes(users, res, sendReportMinutes);
           //res.send(users);
        });
});

function calculateMinutes (users, res, callback) {
    var usersReports = [];
    var userReport = {
        username: null,
        reportminutes: []
    };

    var  repMin = [];

    for(var i = 0, len = users.length; i < len; i++){
        var name = users[i].lastname + " " + users[i].firstname;
        userReport.username = name;

        for(var j = 0, len1 = users[i].report.length; j < len1; j++){
            var obj = {}
            obj.check_in = new Date(users[i].report[j].check_in);
            obj.check_out = new Date(users[i].report[j].check_out);
            obj.report = users[i].report[j].calcTime();
            repMin.push(obj);
            //console.dir(obj);
       }
        userReport.reportminutes = repMin;
        usersReports.push(userReport);
        repMin = []
        userReport = {}
    }

    callback(usersReports, res);
}

function sendReportMinutes(userReport, res) {
    res.send(userReport);
}

//if Users populater from Reports
// function calculateMinutes (report, callback, usersReports, res) {
//     var reportMinutes = [];
//     var name = '';
//
//     for(var i = 0; i < report.length; i++){
//         if(i === 0){
//             name = report[i].employee.lastname + " " +report[i].employee.firstname;
//             usersReports.name = name;
//         }
//         reportMinutes.push(report[i].calcTime());
//     }
//     callback(reportMinutes, usersReports, res);
// };
//
// function sendReportMinutes(reportMinutes, usersReports, res) {
//     usersReports.reportminutes = reportMinutes;
//     res.send(usersReports);
// }


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
