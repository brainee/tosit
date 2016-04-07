/**
 * Created by alex on 15/9/1.
 */
var auth = require('../middlewares/auth'),
    proxy = require('../proxy'),
    User = proxy.User,
    utils = require('./utils'),
    smsModel = require('../lib/sms');
/**
 * 用户设置
 */
exports.index = function (req, res) {

};

// 检查手机号是否已注册
function isReg(mobile, callback) {
    var state, msg;

    var callback = callback || function (data) {
        };

    User.getLoginUser(mobile, function (err, rq) {
        if (!!rq) {
            state = "fail";
            msg = "该手机号已经注册";
        } else {
            state = "ok";
            msg = "";
        }
        callback({
            state: state,
            msg: msg
        })
    });
}

/**
 * 注册
 */
exports.reg = function (req, res) {
    res.render('reg', {title: '注册页'});
};
exports.regPost = function (req, res) {

    var mobile = req.body.tel,
        yzm = req.body.yzm,
        passwd = req.body.passwd;

    var regPwd = /^[\@A-Za-z0-9\!\#\$\%\^\&\*\.\~]{6,22}$/;

    if (!(req.session && req.session[mobile] && req.session[mobile].vcode === yzm)) {
        res.send({
            state: "fail",
            msg: "验证码错误"
        });
    }

    if (!regPwd.test(passwd)) {
        res.send({
            state: "fail",
            msg: "密码格式错误"
        });
    }

    isReg(mobile, function (data) {
        if (data.state === "ok") {
            User.createUser(mobile, passwd, function (err, sres) {
                if (err) {
                    res.send({
                        state: "fail",
                        msg: err
                    })
                } else {
                    req.session.user = sres;
                    res.send({
                        state: "ok",
                        msg: "注册成功"
                    })
                }
            })
        } else {
            res.send({
                state: data.state,
                msg: data.msg
            });
        }
    })
};
exports.regCheck = function (req, res) {
    var mobile = req.body.mobile;

    isReg(mobile, function (data) {
        //console.log("check");
        if(data && data.state == 'ok'){
            utils.sendSms(req, res);
        }
        res.send(data);
    });
};
/**
 * 登陆
 */
exports.login = function (req, res) {
    res.render('login', {title: '登录 | 注册', burl: req.query.burl});
};
exports.loginPost = function (req, res) {

    User.getLoginUser(req.body.tel, function (err, rq) {
        if (err) {
            req.session.error = '数据库操作有误';
            res.send({
                state: "fail",
                msg: "数据库操作有误"
            });
        } else if (!rq) {
            res.send({
                state: "fail",
                msg: "该用户不存在"
            });
        } else {

            if (rq.password == req.body.passwd) {
                //写入session
                req.session.user = rq;
                res.send({
                    state: "ok",
                    msg: "登录成功"
                })
                //res.redirect('/');
            } else {
                //res.render('login', {title: '登录 | 注;
                res.send({
                    state: "fail",
                    msg: "密码输入错误"
                });
            }
        }
        //}
    });

    //var html = "<h2>你好, " + req.body.tel + "</h2><a href='/logout'>退出</a>";
    //res.send(html);
};
exports.logout = function (req, res) {
    req.session.destroy(function (err) {
        if (!err) {
            res.redirect('back');
        }
    });
};
exports.checkLogin = function (req, res) {

    if (req.session && req.session.user) {
        res.send(req.session.user);
    } else {
        res.send('fail');
    }
};

/**
 * 修改密码
 */
exports.changePwd = function (req, res) {
    res.render('user/change_pwd', {title: '修改密码', subTitle: '修改密码'});
};
exports.changePwdPost = function (req, res) {

    var mobile = req.body.phone,
        oldpwd = req.body.oldpwd;

    User.getLoginUser(mobile, function (err1, result) {
        if (result) {
            if (result.password == oldpwd) {
                var newpwd = req.body.password;

                var conditions = {_id: result.id};
                var update = {password: newpwd};
                User.editUser(conditions, update, function (err, result1) {

                    if (err) {
                        res.send('fail');
                    } else {
                        res.send('ok');
                    }
                });
            }
            else {
                res.send('fail');
            }
        } else {
            res.send('fail');
        }
    })

};
/**
 * 找回密码
 */
exports.findPwd = function (req, res) {
    res.render('find', {title: '找回密码'});
};
exports.findPwdPost = function (req, res) {
    var randomNum = utils.randomNum(6),
        mobile = req.body.phone;

    var conditions = {phone: mobile};
    var update = {password: randomNum};
    User.editUser(conditions, update, function (err, result) {
        if (err) {
            res.send('fail');
        } else {
            if (process.env.NODE_ENV === 'development') {
                console.log(randomNum);
            } else {
                smsModel.send(mobile, '亲爱的用户，您的验证码是：' + randomNum + ', 请在30分钟内使用。');
            }
            res.send('ok');
        }
    });
};