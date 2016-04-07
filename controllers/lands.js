/**
 * Created by alex on 15/10/20.
 * Landing Page
 * 活动预约（无需登陆）
 */

var moment = require('moment'),
    csv = require('csv'),
    model = require('../models'),
    proxy = require('../proxy'),
    reserveModel = model.Reserve,
    productModel = model.Product;
// 活动预约
// 预约入口
exports.appointment = function (req, res) {
    res.render('lands/land10001', {title: '到喜啦大礼包活动预约', channel: req.query.channel});
};
// 数据采集-预约到店
exports.input10001 = function (req, res) {
    res.render('lands/input10001', {title: '到喜啦大礼包活动预约', channel: req.query.channel});
};
exports.post10001 = function (req, res) {
    var storeInfo = req.session[req.body.phoneNumber];
    if (!(storeInfo && storeInfo.vcode == req.body.vCode)) {
        res.send({state: 'fail', msg: '验证码错误，请重试'});
        res.end();
        return;
    } else {
        var now = moment();
        var overtime = moment(storeInfo.time).add(5, 'minutes');
        if (now > overtime) { // 验证码过期
            res.send({state: 'fail', msg: '验证码已过期请重新获取'});
        }
    }
    reserveModel.create(req.body, function (err, result) {
        if (err) throw err;
        if (result) {
            res.send({state: 'ok', data: result});
        } else {
            res.send({state: 'fail', msg: '保存数据失败'});
        }
        res.end();
    });
};
