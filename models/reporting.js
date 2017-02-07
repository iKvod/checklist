'use strict';

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;

var Schema = mongoose.Schema;


var ReportingSchema = new Schema({
    check_in: Date,
    check_out: Date,
    lunch_in: Date,
    lunch_out: Date,
    go_out: Date,
    come_back: Date,
    // created_at: { type: Date, default: Date.now },
    // updated_at: { type: Date, default: Date.now },
    report: { type: String },
    employee: { // position id of employee
        type: Schema.Types.ObjectId,
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