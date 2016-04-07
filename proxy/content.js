/**
 * Created by alex on 15/9/19.
 */
var util = require('util'),
    baseProxy = require('./base_proxy'),
    models = require('../models'),
    contentModel = models.Content,
    contentProxy = new baseProxy(contentModel);

exports.getContentByKey = function (key, callback) {
    contentProxy.getOne({key: key}, callback);
};

exports.getKeys = function (callback) {
    contentModel.find({}).select('key title').exec(callback);
};

exports.getContentList = function (criteria, callback) {
    contentProxy.getList(criteria, callback);
};

exports.createContent = function (entity, callback) {
    contentProxy.createOne(entity, callback);
};

exports.editContent = function (conditions, update, callback) {
    contentProxy.editOne(conditions, update, callback);
};

exports.delContent = function (conditions, callback) {
    contentProxy.delete(conditions, callback);
};
