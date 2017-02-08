'use strict';

// for rating system among employees

var mongoose = require('mongoose');
mongoose.Promise = global.Promise

var Schema = mongoose.Schema;

var EmployeesSchema = new Schema({
    number: { type: Number, default: 0 },
    positions: [{type: String, default: 'Intern'}]
    // rating: { type: Number },
    //employee: [{type: Schema.ObjectId, ref:'Employee'}]
});

module.exports = mongoose.model('Employees', EmployeesSchema);

EmployeesSchema.pre('save', function (next) {
    this.number += 1;
});