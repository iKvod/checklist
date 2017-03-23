'use strict';

var mongoose = require('mongoose');
mongoose.Promise = global.Promise

var Schema = mongoose.Schema;
//var passportLocalMongoose = require('passport-local-mongoose');

var Employee = new Schema({
    employee_id: {type: String, unique: true},
    botId: {type: String, unique: true},
    // botId: {type: String},
    username: String,
    firstname: {type: String, default:'NoName'},
    lastname: {type: String, default: 'NoLastname'},
    email: String,
    disabled: {type: Boolean, default: false},
    phonenumber: {type:String},
    department: { type: Schema.Types.ObjectId, ref: 'Departments' },
    position: { type: Schema.Types.ObjectId, ref: 'Positions' },
    salary_fixed: {
        type: Number,
        default: 0.0
    },
    bonus: {
        type: Number,
        default: 0.0
    },
    work_time: { //fixed work time
      type: Number,
      default: 0
    },
    registered_at: { type: Date, default: Date.now },
    checked: {
        type: Boolean,
        default:false
    },
    updated: Date,
    rating: [{type: Number}],
    report: [{
        type: Schema.Types.ObjectId,
        ref: 'Reporting'
    }],
    book: [{ type: Schema.Types.ObjectId, ref: 'Books' }],
    admin: {
        type: Boolean,
        default: false
    },
    code: [{type: String}],
},{
    timestamp:true
});

// Employee.pre('save', function(){
//
// });


Employee.pre('save', function (next) {
    var currentDate = new Date();
    this.updated = currentDate;
    next();
});

Employee.methods.disableEmployee = function () {
  this.disabled = true;
};

Employee.methods.enableEmployee = function () {
  this.disabled = false;
};

Employee.methods.getName = function () {
  return this.firstname + ' ' + this.lastname;
};

Employee.methods.getId = function(){
    return this.id;
};

Employee.methods.getBotId = function(){
    return this.botId;
};

//User.plugin(passportLocalMongoose);

module.exports = mongoose.model('Employee', Employee);