"use strict";
// UNNESSERY SCHEMA
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var Schema = mongoose.Schema;

var CalendarSchame = new Schema({
    sundays: [{type: Date, default: null}],
    saturdays: [{type: Date, default: null}],
    holidays: [{type: Date, default: null}],
    //weekdayType: {type: String, default: 'workday'}, // workday, holiday
    reportings: [{type: Schema.ObjectId, ref:'Reporting'}]
});

module.exports = mongoose.model('Calendar', CalendarSchame);