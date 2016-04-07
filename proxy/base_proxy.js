/**
 * Created by alex on 15/9/21.
 */
var models = require('../models');
exports = module.exports = Base;

function Base(model) {
    this.model = model;
}

Base.prototype.getList = function (criteria, callback) {
    var _criteria = criteria || {}, // 查询条件
        _sort = '-create_at';
    this.model
        .find(_criteria)
        .sort(_sort)
        .exec(callback);
};

Base.prototype.getList2 = function (criteria, filter, callback) {
    var _criteria = criteria || {}, // 查询条件
        _page = filter.page || 1, // 翻页页码
        _pageSize = filter.pageSize || 25,
        _fields = filter.fields || '', // 待返回的字段
        _sort = filter.sort || '-create_at';
    this.model
        .find(_criteria)
        .sort(_sort)
        .skip((_page - 1) * _pageSize)
        .limit(_pageSize)
        .select(_fields)
        .exec(callback);
};
Base.prototype.getById = function (id, callback) {
    this.model.findOne({_id: id}).exec(callback);
};
/**
 * 查询单挑数据
 * @param criteria 查询条件
 * @param callback 返回单条信息
 */
Base.prototype.getOne = function (criteria, callback) {
    this.model.findOne(criteria).exec(callback);
};
/**
 * 创建用户（用户注册场景）
 * @param entity 数据实体
 * @param callback
 */
Base.prototype.createOne = function (entity, callback) {
    if (entity) {
        this.model.create(entity, callback);
    } else {
        callback(new Error({message: '输入有误'}));
    }
};
/**
 * 修改数据
 * @param conditions 查找数据的条件（最好是严格条件：如_id,或唯一键）
 * @param update 需要更新的字段及值（对照Schma）
 * @param callback
 */
Base.prototype.editOne = function (conditions, update, callback) {
    var opts = {upsert: true};
    update.update_at = new Date();
    this.model.update(conditions, {$set: update}, opts, callback);
};
/**
 * 删除一条或多条数据
 * @param conditions 查找数据的条件
 * @param callback
 */
Base.prototype.delete = function (conditions, callback) {
    this.model.remove(conditions, callback);
};

/**
 * 删除一条或多条数据
 * @param conditions 查找数据的条件
 * @param callback
 */
Base.prototype.deleteAll = function (ids,fieldname, callback) {
    this.model.where(fieldname).in(ids).remove().exec(callback);
};


Base.prototype.getListByIds = function (ids,fieldname, callback) {
    this.model
        .find()
        .where(fieldname)
        .in(ids)
        .exec(callback);
};

/**
 * 统计数字
 * @param conditions 查找数据的条件
 * @param callback
 */
Base.prototype.count = function (conditions, callback) {
    this.model.count(conditions, callback);
};
