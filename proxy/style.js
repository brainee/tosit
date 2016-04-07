/**
 * Created by alex on 15/9/17.
 */
var models = require('../models'),
    styleModel = models.ProductStyle,
    baseProxy = require('./base_proxy'),
    styleProxy = new baseProxy(styleModel);

exports.getAll = function (callback) {
    styleProxy.getList({}, callback);
};

exports.addStyle = function (key, name, callback) {
    styleProxy.createOne({key: key, name: name}, callback);
};

exports.editStyle = function (id, key, name, callback) {
    styleProxy.editOne({_id: id}, {key: key, name: name}, callback);
};

exports.delStyle = function (id, callback) {
    styleProxy.delete({_id: id}, callback);
};
