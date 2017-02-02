'use strict';

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;

var Schema = mongoose.Schema;


var ReportingSchema = new Schema({
    checkin: Date,
    checkout: Date,
    lunchin: Date,
    lunchout: Date,
    goOUt: Date,
    comeback: Date,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    report: { type: String },
    employee: { // position id of employee
        type: String,
        ref:'Employee'
    },
}, {
    timestamps: true
});

ReportingSchema.pre('save', function (next) {
    var currentDate = new Date();

    this.updated_at = currentDate;

    if(!this.created_at)
        this.created_at = currentDate;

    next();
});
module.exports = mongoose.model('Reporting', ReportingSchema);