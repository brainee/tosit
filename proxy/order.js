/**
 * Created by alex on 15/10/6.
 */
'use strict';
var models = require('../models'),
    baseProxy = require('./base_proxy'),
    orderModel = models.Order,
    orderProxy = new baseProxy(orderModel);

exports.getList = function (criteria, callback, sort) {
    orderProxy.getList(criteria,  callback ,sort);
};

exports.add = function (entity, callback) {
    orderProxy.createOne(entity, callback);
};

exports.edit = function (id, update, callback) {
    orderProxy.editOne({_id: id}, update, callback);
};

exports.del = function (id, callback) {
    orderProxy.delete({_id: id}, callback);
};

exports.count = function (conditions, callback) {
    orderProxy.count(conditions, callback);
};

exports.getById = function (conditions, callback) {
    orderProxy.getById(conditions, callback);
};