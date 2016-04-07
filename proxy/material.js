/**
 * Created by alex on 15/9/17.
 */

var models = require('../models'),
    materialModel = models.ProductMaterial,
    baseProxy = require('./base_proxy'),
    materialProxy = new baseProxy(materialModel);

exports.getList = function (criteria, callback) {
    materialProxy.getList(criteria, callback);
};

/**
 * 获取所有分类信息
 * @param callback
 */
exports.getAll = function (callback) {
    materialProxy.getList({}, callback);
};

exports.getOne = function (criteria, callback) {
    materialProxy.getOne(criteria, callback);
};

exports.add = function (entity, callback) {
    materialProxy.createOne(entity, callback);
};

exports.edit = function (id, update, callback) {
    materialProxy.editOne({_id: id}, update, callback);
};

exports.del = function (id, callback) {
    materialProxy.delete({_id: id}, callback);
};

exports.delItem = function (id, itemid, callback) {
    materialProxy.delete({_id: _id, items: {_id: itemid}}, callback);
};
