/**
 * Created by alex on 15/7/27.
 */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongokeeper = require('../lib/mKeeper');
var moment = require('moment');

var bookModel = function () {
    var bookSchema = new Schema({
        userName: {type: String, default: '匿名用户'},
        birthday: Date,
        weddingDate: Date,
        height: Number,
        weight: Number,
        area: String,
        phoneNumber: String,
        appointmentTime: Date,
        channel: String,
        remark: String,
        createTime: {type: Date, default: Date.now}
    });
    //因为使用了createConnection 这里要使用mongokeeper.db.model
    //而不是mongoose.model
    return mongokeeper.db.model('books', bookSchema);
};

exports = module.exports = new bookModel();