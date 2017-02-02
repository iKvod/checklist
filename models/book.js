'use strict';

var mongoose = require('mongoose');
mongoose.Promise = global.Promise

var Schema = mongoose.Schema;

var BookSchema = new Schema({
   title: { type: String },
    link: { type: String },
    employee: [{type: Schema.ObjectId, ref:'Employee'}]
});

module.exports = mongoose.models('Books', BookSchema);