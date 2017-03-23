/**
 * Created by rafa on 13/03/2017.
 */
'use strict';

// for counting # of employees

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  autoIncrement = require('mongoose-auto-increment');

var config = require('../config');
// mongoose.connect(config.mongoUrl, config.opt);
var connection = mongoose.createConnection(config.mongoUrl);
// var connection = mongoose.createConnection(config.mongoUrl, config.opt); //for testing purposes

autoIncrement.initialize(connection);

mongoose.Promise = global.Promise;
var EmploymentSchema = new Schema({
  botid: { type: String, unique: true },
  counter: { type: Number, default: 0 }, //the number of employees
  registred: { type: Boolean, default: false },
  registredAt: { type: Date, default: Date.now }
  // rating: { type: Number },
    //employee: [{type: Schema.ObjectId, ref:'Employee'}]
});

EmploymentSchema.methods.incrCounter = function () {
  this.counter += 1;
};
//for id generator
EmploymentSchema.methods.getCounter = function () {
  return this.counter;
};


EmploymentSchema.plugin(autoIncrement.plugin, {
  model:'Employment',
  field: 'counter',
  startAt: 1,
  incrementBy: 1
});

module.exports = mongoose.model('Employment', EmploymentSchema);
