/**
 * Created by alex on 15/9/1.
 */
var proxy = require('../proxy');
var Order = proxy.Order;
var tools = require('../lib/tools');
var Cart = proxy.Cart;
var _ = require('lodash');
/**
 * 订单首页
 */
exports.index = function (req, res, next) {

};
/**
 * 订单列表
 */
exports.list = function (req, res, next) {

};
/**
 * 订单搜索
 */
exports.search = function (req, res, next) {

};
// offline
/**
 * 订单管理列表
 */
exports.manage = function (req, res, next) {
    Order.getList(function (err, data) {
        tools.formatList(data);
        res.render('offline/orders', {
            title: "订单管理",
            orderList: data
        });
    });
};
/**
 * 订单修改
 */
exports.eidt = function (req, res, next) {

};
/**
 * 订单删除
 */
exports.del = function (req, res, next) {
    Order.del(req.body._id, function (err, data) {
        if (!err) {
            res.json({
                resultCode: 0,
                resultMsg: 'Success!'
            });
        } else {
            res.json({
                resultCode: 1,
                resultMsg: err
            });
        }
    })
};

/**
 * 订单创建
 */
exports.add = function (req, res, next) {
    if (req.body.cartIds && req.body.cartIds.length > 4) {
        res.json({
            resultCode: -2,
            resultMsg: "产品数量不能超过4件"
        });
    } else {
        //console.log(req.body.cartIds);
        Cart.getListByIds(req.body.cartIds, function (err, data) {
            //console.log(data);
            if (err) {
                res.json({
                    resultCode: -1,
                    err: err
                });
            } else {
                var price = 0;
                _.forEach(data, function (val) {
                    price += val.items.product.refPrice;
                });
                var stamp = new Date().getTime() + "";
                Order.add({
                    orderId: stamp.slice(-8),
                    uid: res.locals.user._id,
                    userInfo: {
                        phone: res.locals.user.phone
                    },
                    price: price,
                    state: "待支付",
                    remark: "",
                    cart: data
                }, function (err, data) {
                    if (!err) {
                        Cart.delAll(req.body.cartIds, function (err, data) {
                            if (!err) {
                                res.json({
                                    resultCode: 0,
                                    resultMsg: "Success!"
                                });
                            } else {
                                res.json({
                                    resultCode: -2,
                                    resultMsg: err
                                });
                            }
                        })
                    } else {
                        res.json({
                            resultCode: -1,
                            err: err
                        });
                    }
                });
            }
        });
    }

};

exports.download = function (req, res) {
    Order.getList(function (err, list) {
        if (err) {
            throw err;
        } else {
            tools.formatList(list);
            var result = [], content = '';
            content += '订单号,联系人,订单总价,订单状态,下单时间,修改时间,备注\r\n';
            list.forEach(function (e, i) {
                var t = e;
                content += t.orderId + ',';
                content += ((t.userInfo || {}).phone || '') + ',';
                content += t.price + ',';
                content += t.state + ',';
                content += t.create + ',';
                content += t.update + ',';
                content += t.remark + ',';
                content += '\r\n';
            });
            var file = new Date().getTime();
            res.set({
                'Content-Type': 'text/csv',
                'Content-disposition': 'attachment;filename=' + encodeURIComponent(file) + '.csv',
                'Pragma': 'no-cache',
                'Expires': 0
            });
            var buffer = new Buffer(content);
            var iconv = require('iconv-lite');
            var str = iconv.encode(buffer, 'gb2312');
            res.send(str);

            //res.write(new Buffer('\xEF\xBB\xBF', 'binary'));//add utf-8 bom
            //csv().from.array(result).to(res);
            //csv.stringify(result).pipe(res);
        }
    })
};