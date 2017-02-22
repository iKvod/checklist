'use strict';

// Unnessary schema
var mongoose =require('mongoose');
mongoose.Promise = global.Promise;

var Schema = mongoose.Schema;

var SalarySchema = new Schema({
    salaryFixed: {type: Number},
    employee_id : [
        {
            type: Schema.Types.ObjectId,
            ref: 'Employees'
        }
    ]
});

