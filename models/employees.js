'use strict';

// for rating system among employees

var mongoose = require('mongoose');
mongoose.Promise = global.Promise

var Schema = mongoose.Schema;

var EmployeesSchema = new Schema({
    number: { type: Number, default: 0 },
    positions:[{type: String, default: 'Intern'}],

    : { type: String },
    employee: [{type: Schema.ObjectId, ref:'Employee'}]
});

module.exports = mongoose.models('Employees', EmployeesSchema);