/**
 * Created by alex on 15/9/17.
 */
var models = require('../models'),
    imageModel = models.Image,
    baseProxy = require('./base_proxy'),
    imageProxy = new baseProxy(imageModel);

exports.getAll = function (callback) {
    imageProxy.getList({}, callback);
};

exports.add = function (entity, callback) {
    imageProxy.createOne(entity, callback);
};

exports.edit = function (id, update, callback) {
    imageProxy.editOne({_id: id}, update, callback);
};

exports.del = function (id, callback) {
    imageProxy.delete({_id: id}, callback);
};
