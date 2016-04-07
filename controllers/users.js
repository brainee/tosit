/**
 * Created by alex on 15/9/1.
 */
var validator = require('validator'),
    moment = require('moment'),
    EventProxy = require('eventproxy'),
    _ = require('lodash'),
    tools = require('../lib/tools'),
    proxy = require('../proxy'),
    User = proxy.User,
    Cart = proxy.Cart,
    Product = proxy.Product,
    Order = proxy.Order;

/**
 * 用户中心首页
 */
exports.index = function (req, res) {
    res.render('user/uc');
};
/**
 * 我的订单
 */
exports.orders = function (req, res) {
    Order.getList({uid: res.locals.user._id}, function (err, data) {
        var orderInfo = {};
        _.forEach(data, function (valData) {
            orderInfo[valData._id]={};
            orderInfo[valData._id].price = 0;
            orderInfo[valData._id].time = moment(valData.create_at).format('YYYY-MM-DD H:mm:ss');
            _.forEach(valData.cart, function (val) {
                orderInfo[valData._id].price += +val.items.product.refPrice;
            })
        });
        if (!err) {
            //console.log(data);
            res.render('user/orders', {
                title: "会员中心－我的订单",
                subTitle: "我的订单",
                data: data,
                orderInfo: orderInfo
            })
        }
    });

};
/**
 * 核对订单
 */
exports.ordersCheck = function (req, res) {
    if(req.params&&req.params.oid) {
        Order.getById(req.params.oid, function (err, data) {
            if (!err && data && data.uid == res.locals.user._id) {
                res.render('user/orders_check', {
                    title: "核对订单",
                    data: data
                })
            } else {
                res.render('user/orders_check', {
                    title: "核对订单",
                    data: {cart:{}}
                })
            }
        })
    }else{
        res.render('user/orders_check', {
            title: "核对订单",
            data: {cart:{}}
        })
    }
};
/**
 * 穿衣人档案
 */
exports.record = function (req, res) {
    res.render('user/record', {
        title: "会员中心－穿衣人档案",
        subTitle: "穿衣人档案"
    })
};
/**
 * 账户信息
 */
exports.info = function (req, res) {
    //res.render('user/info', {
    //    title: "会员中心－账户信息",
    //    subTitle: "账户信息",
    //    data: req.session.user
    //});
    //if (req.session && req.session.loginSession) {

    User.getLoginUser(req.session.user.phone, function (err, result) {
        if (result) {
            res.render('user/info', {
                title: "会员中心－账户信息",
                subTitle: "账户信息",
                data: result
            })
        } else {
            res.render('user/info', {
                title: "会员中心－账户信息",
                subTitle: "账户信息"
            })
        }
    });
    //}
    //else {
    //    res.render('login', {title: '登录 | 注册'});
    //}
};


exports.infopost = function (req, res) {
    //console.log(req.body);
    var mobile = req.body.phone;

    var conditions = {phone: mobile};
    var update = req.body;

    User.editUser(conditions, update, function (err, data) {
        if (err) {
            res.send('fail');
        } else {
            console.log('============\n'+data);
            User.getLoginUser(req.session.user.phone, function (err, result) {
                res.locals.user = req.session.user = result;
                res.send('ok');
            });
        }
    });
};


/**
 * 预约单
 */
exports.appointments = function (req, res) {

};
/**
 * 试衣间
 */
exports.changingRoom = function (req, res) {
    Cart.getList(res.locals.user._id, function (err, data) {
        var timeArr = [];
        _.forEach(data, function (val) {
            timeArr.push(moment(val.create_at).format('YYYY-MM-DD H:mm:ss'))
        });
        res.render('user/changing_room', {
            title: "会员中心－试衣间",
            subTitle: "试衣间",
            cartList: data,
            timeArr: timeArr
        });
    });
};
/**
 * 购物车 post
 */
exports.addCart = function (req, res) {
    Product.instance.getById(req.params.pid, function (err, product) {
        req.body.items.product = product;
        var param = _.extend(req.body, {uid: res.locals.user._id});
        Cart.addCart(param, function (err, data) {
            if (!err) {
                res.json({
                    resultCode: 0,
                    resultMsg: 'Success!'
                });
            } else {
                res.json({
                    resultCode: 1,
                    resultMsg: 'Save Failed!'
                });
            }
        });
    });
};


/**
 * 购物车 post
 */
exports.removeCarts = function (req, res) {
    Cart.delAll(req.body.ids, function (err, data) {
        if (!err) {
            res.json({
                resultCode: 0,
                resultMsg: 'Success!'
            });
        } else {
            res.json({
                resultCode: 1,
                resultMsg: 'Del Failed!'
            });
        }
    })
};

// offline
/**
 * 用户管理
 */
exports.manage = function (req, res) {
    var loginName = validator.trim(req.body.loginname).toLowerCase();
    var email = validator.trim(req.body.email).toLowerCase();
    var phone = validator.trim(req.body.phone).toLowerCase();
    User.getUserList({}, function (err, users) {
        if (err) {
            return next(err);
        } else {
            tools.formatList(users);
            res.render('offline/users', {title: '注册用户管理', data: users});
        }
    });
};
exports.detail = function (req, res) {
    var id = req.params.id;
    User.getUserById(id, function (err, user) {
        if (err) {
            throw err;
        }
        else {
            user.create = tools.formatDate(user.create_at);
            user.update = tools.formatDate(user.update_at);
            res.render('offline/users/edit', {title: '用户详情', data: user});
        }
    });
};
exports.editPost = function (req, res) {

    var conditions = {_id: req.params.id};
    var update = req.body;
    User.editUser(conditions, update, function (err, result) {
        if (err) {
            res.send('fail');
        } else {
            res.send('ok');
        }
    });
};
exports.delPost = function (req, res) {
    var conditions = {_id: req.params.id};
    User.delUser(conditions, function (err, result) {
        if (err) {
            res.send('fail');
        } else {
            res.send('ok');
        }
    });
};
