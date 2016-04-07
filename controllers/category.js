/**
 * Created by alex on 15/9/4.
 */
var tools = require('../lib/tools'),
    proxy = require('../proxy'),
    categoryProxy = proxy.Category;

var mock = exports.mock = {
    "cat": "类别",
    "list": [
        {"name": "套装", "key": "tz"},
        {"name": "单西服", "key": "dxz"},
        {"name": "裤子", "key": "kz"},
        {"name": "西装", "key": "xz"},
        {"name": "衬衣", "key": "cy"},
        {"name": "大衣", "key": "dy"},
        {"name": "配饰", "key": "ps"}
    ]
};
/**
 * 获取产品类型
 */
exports.get = function (req, res) {
    res.json(mock);
};

// offline
/**
 * 分类管理页
 */
exports.manage = function (req, res) {
    categoryProxy.getAll(function (err, result) {
        tools.formatList(result);
        res.render('offline/category', {title: '首页', data: result});
    });
};
exports.add = function (req, res) {
    categoryProxy.addCategory(req.body.key, req.body.name, function (err, result) {
        if (err) {
            res.send({status:'fail', data: err});
        } else {
            res.send({status:'ok', data: result});
        }
    });
};

exports.edit = function (req, res) {
    categoryProxy.editCategory(req.params.id, req.body.key, req.body.name, function (err, result) {
        if (err) {
            res.send({status:'fail', data: err});
        } else {
            res.send({status:'ok', data: result});
        }
    });
};

exports.delete = function (req, res) {
    categoryProxy.delCategory(req.params.id, function (err, result) {
        if (err) {
            res.send({status:'fail', data: err});
        } else {
            res.send({status:'ok', data: result});
        }
    });
};
