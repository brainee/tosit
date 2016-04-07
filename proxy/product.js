/**
 * Created by alex on 15/9/7.
 */
var models = require('../models');
var productModel = models.Product;
var baseProxy = require('./base_proxy');
var productProxy = new baseProxy(productModel);
exports.instance = productProxy;
// Offline管理界面
/**
 * 根据关键字，获取一组产品
 * @param {String} criteria 查询条件
 * @param {Function} callback 回调函数
 * - err, 数据库异常
 * - data, 数据列表
 */
exports.getProductList = function (criteria, callback) {
    productProxy.getList(criteria, callback);
}
exports.getProductList2 = function (criteria, filter, callback) {
    productProxy.getList2(criteria,filter, callback);
};
/**
 * 创建产品
 * @param entity 产品实体
 * @param callback
 */
exports.createProduct = function (entity, callback) {
    productProxy.createOne(entity, callback);
}
/**
 * 根据产品编号查找产品
 * @param code 产品编号
 * @param callback 返回对应产品所有信息，否无该产品则返回undefined
 */
exports.getProductByCode = function (code, callback) {
    if (!code) return;
    var _criteria = {code: code};
    productProxy.getOne(_criteria, callback);
};

exports.getProductById = function (id, callback) {
    if (!id) return;
    productProxy.getOne({_id:id}, callback);
};

/**
 * 修改产品
 * @param conditions 搜索条件（最好是严格条件）
 * @param update 需要更新的字段及值
 * @param callback
 */
exports.editProduct = function (conditions, update, callback) {
    productProxy.editOne(conditions, update, callback);
};
/**
 * 删除产品
 * @param conditions 搜索用户的条件
 * @param callback;
 */
exports.delProduct = function (conditions, callback) {
    productProxy.delete(conditions, callback);
};
