/**
 * Created by alex on 15/9/7.
 */
var models = require('../models'),
    userModel = models.User,
    baseProxy = require('./base_proxy'),
    userProxy = new baseProxy(userModel);

/**
 * 根据关键字，获取一组用户
 * Callback:
 * - err, 数据库异常
 * - users, 用户列表
 * @param {String} criteria 查询条件
 * @param {Function} callback 回调函数
 */
exports.getUserList = function (criteria, callback) {
    userProxy.getList(criteria, callback);
};
exports.getUserById = function (id, callback) {
    userProxy.getOne({_id: id}, callback);
};


/**
 * 支持手机号、邮箱、用户名查询
 * @param token 手机号、邮箱、用户名
 * @param callback 返回当前用户所有信息，否无该用户则返回undefined
 */
exports.getLoginUser = function (token, callback) {
    if (!token) return;
    var _criteria = {$or: [{loginname: token}, {email: token}, {phone: token}]};
    userProxy.getOne(_criteria, callback);
};
/**
 * 创建用户（用户注册场景）
 * @param phone 手机号
 * @param pwd 密码
 * @param callback
 */
exports.createUser = function (phone, pwd, callback) {
    userProxy.createOne({phone: phone, password: pwd}, callback);
};
/**
 * 修改用户
 * @param conditions 搜索用户的条件（最好是严格条件）
 * @param update 需要更新的字段及值
 * @param callback
 */
exports.editUser = function (conditions, update, callback) {
    userProxy.editOne(conditions, update, callback);
};
/**
 * 删除用户
 * @param conditions 搜索用户的条件
 * @param callback
 */
exports.delUser = function (conditions, callback) {
    userProxy.delete(conditions, callback);
};
