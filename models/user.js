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
    firstname: {type: String, default:''},
    lastname: {type: String, default: ''},
    email: String,
    phonenumber: {type:String},
    department: String,
    position: String,
    registered_at: { type:Date, default:Date.now},
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
})

Employee.method.getName = function () {
  return this.firstname + ' ' + this.lastname;
};

Employee.method.getId = function(){
    return this.id;
};

Employee.method.getBotId = function(){
    return this.bot_id;
};

//User.plugin(passportLocalMongoose);

module.exports = mongoose.model('Employee', Employee);