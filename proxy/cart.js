/**
 * Created by feng on 2015/10/24.
 */
var models = require('../models');
var CartModel = models.Cart;
var baseProxy = require('./base_proxy');
var cartProxy = new baseProxy(CartModel);
//exports.instance = cartProxy;
/**
 * 加入购物车
 * @param entity 产品信息
 * @param callback
 */
exports.addCart = function (entity, callback) {
    cartProxy.createOne(entity, callback);
};

exports.getList = function (uid, callback) {
    cartProxy.getList({uid:uid}, callback);
};

exports.del = function (uid, callback) {
    cartProxy.delete({uid: uid}, callback);
};

exports.count = function (conditions, callback) {
    cartProxy.count(conditions, callback);
};

exports.delAll = function (ids, callback) {
    cartProxy.deleteAll(ids,'_id', callback);
};

exports.getListByIds = function(ids,callback){
    cartProxy.getListByIds(ids,'_id', callback);
}