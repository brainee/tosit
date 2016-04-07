/**
 * Created by alex on 15/9/16.
 */

var models = require('../models'),
    categoryModel = models.ProductCategory,
    baseProxy = require('./base_proxy'),
    categoryProxy = new baseProxy(categoryModel);

exports.getList = function (criteria, callback) {
    categoryProxy.getList(criteria, callback);
};

exports.getAll = function (callback) {
    categoryProxy.getList({}, callback);
};

exports.addCategory = function (key, name, callback) {
    categoryProxy.createOne({key: key, name: name}, callback);
};

exports.editCategory = function (id, key, name, callback) {
    categoryProxy.editOne({_id: id}, {key: key, name: name}, callback);
};

exports.delCategory = function (id, callback) {
    categoryProxy.delete({_id: id}, callback);
};
