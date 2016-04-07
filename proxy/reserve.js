/**
 * Created by alex on 15/10/20.
 */

var models = require('../models'),
    reserveModel = models.Reserve,
    baseProxy = require('./base_proxy'),
    reserveProxy = new baseProxy(reserveModel);

exports.getList = function (criteria, callback) {
    reserveProxy.getList(criteria, callback);
};

exports.add = function (entity, callback) {
    reserveProxy.createOne(entity, callback);
};

exports.edit = function (id, update, callback) {
    reserveProxy.editOne({_id: id}, update, callback);
};

exports.del = function (id, callback) {
    reserveProxy.delete({_id: id}, callback);
};

