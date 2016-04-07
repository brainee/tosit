/**
 * Created by alex on 15/9/16.
 */
var tools = require('../lib/tools'),
    proxy = require('../proxy'),
    styleProxy = proxy.Style;

var User = proxy.User;
var mock = exports.mock = {
    "cat": "风格",
    "list": [
        {"name": "婚礼", "key": "hl"},
        {"name": "商务休闲", "key": "swxx"},
        {"name": "派对&酒吧", "key": "pd"}]
};

// offline
/**
 * 产品风格管理
 */
exports.manage = function (req, res, next) {
    styleProxy.getAll(function (err, result) {
        tools.formatList(result);
        res.render('offline/style', {title: '产品风格', data: result});
    });
};
/**
 * 产品风格
 */
exports.get = function (req, res, next) {
    res.json(mock);
};

exports.add = function (req, res) {
    styleProxy.addStyle(req.body.key, req.body.name, function (err, result) {
        if (err) {
            res.send({status: 'fail', data: err});
        } else {
            res.send({status: 'ok', data: result});
        }
    });
};

exports.edit = function (req, res) {
    styleProxy.editStyle(req.body._id, req.body.key, req.body.name, function (err, result) {
        if (err) {
            res.send({status: 'fail', data: err});
        } else {
            res.send({status: 'ok', data: result});
        }
    });
};

exports.delete = function (req, res) {
    styleProxy.delStyle(req.params.id, function (err, result) {
        if (err) {
            //console.log(1);
            res.send({status: 'fail', data: err});
        } else {
            //console.log(2);

            res.send({status: 'ok', data: result});
        }
    });
};
