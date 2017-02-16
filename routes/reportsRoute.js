'use strict';

var express = require('express');
var reportRoute = express.Router();
var Reports = require('../models/reporting');
var Users = require('../models/user');


reportRoute.get('/', function (req, res, next) {
    // Reports.find({})
    //     .populate('employee')
    //     .select('')
    //     .exec(function (err, report) {
    //         console.log(report);
    //         //res.send(report[0].calcTime());
    //         res.send(report);
    //     });

    Users.find({})
        .populate('report')
        .select({'lastname':1,'firstname':1 ,'report': 1})
        .exec(function (err, users) {
            res.send(users);
        });
});

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
