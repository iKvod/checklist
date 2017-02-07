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
    }
});

module.exports = mongoose.model('Books', BookSchema);