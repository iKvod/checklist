'use strict';

var express = require('express');
var reportRoute = express.Router();
var Reports = require('../models/reporting');
var Users = require('../models/user');
var timeCalculator = require('./helpers/TimeCalcReportings/calcMinutes');


reportRoute.get('/', function (req, res, next) {
    Users.find({})
        .populate('report')
        .select({'lastname':1,'firstname':1 ,'report': 1})
        .exec(function (err, users) {
            if (err) {
                return next(err);
            }
            timeCalculator.calculateMinutes(users, res, timeCalculator.sendReportMinutes)
        });
});

reportRoute.get('/:id', function (req, res, next) {
    Reports.findOne({_id: req.params.id})
        .populate('employee')
        .exec(function (err, report) {
            if(err){
                return next(err);
            }
            res.send(report.calcTimeCorrectly());
        })
});

module.exports = reportRoute;