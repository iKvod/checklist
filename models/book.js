'use strict';

var mongoose = require('mongoose');
mongoose.Promise = global.Promise

var Schema = mongoose.Schema;

var BookSchema = new Schema({
    title: { type: String },
    link: { type: String },
    employee: [{type: Schema.ObjectId, ref:'Employee'}],
    required: {
       type: Boolean, default:false
    },
    read : [{type: String, ref:'Employee'}] // if employee read this book (true) or not {false}
});

module.exports = mongoose.model('Books', BookSchema);