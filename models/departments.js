'use strict';

// for rating system among employees

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var Schema = mongoose.Schema;

// var DepartmensSchema = new Schema({
//     counter: { type: Number, default: 0 }, //the number of employees
//     positions: [{type: String, default: 'Intern'}],
//     departments: [{type: String, default: 'IT'}]
//   // rating: { type: Number },
//     //employee: [{type: Schema.ObjectId, ref:'Employee'}]
// });

var DepartmensSchema = new Schema({
  positions: [{type: Schema.ObjectId, ref:'Positions'}],
  department: { type: String }
});

module.exports = mongoose.model('Departments', DepartmensSchema);
