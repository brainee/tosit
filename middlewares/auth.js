/**
 * Created by alex on 15/9/1.
 */
var config = require('../config');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var proxy = require('../proxy');
var User = proxy.User;
var Cart = proxy.Cart;


/**
 * 需要管理员权限
 */
exports.adminRequired = function (req, res, next) {
    if (config.debug) {
        res.locals.user = {loginname: 'debugger'};
        return next();
    }
    var islogin = req.session && req.session.user;
    if (!islogin) {
        res.locals.session = null;
        return res.redirect('/login?burl=' + req.originalUrl);
    } else if (!req.session.user.is_admin) {
        return res.render('login', {error: '需要管理员权限。'});
    } else {
        res.locals.user = req.session.user;
    }
    next();
};

/**
 * 需要登录
 */
exports.userRequired = function (req, res, next) {
    var islogin = req.session && req.session.user;
    if (!islogin) {
        res.locals.session = null;
        return res.redirect('/login?burl=' + req.originalUrl);
    } else {
        res.locals.user = req.session.user;
        next();
    }
};

/**
 * 验证中间键
 */
exports.authenticate = function (req, res, next) {
    res.locals.user = req.session.user;
    res.locals.cartCount = 0;
    var err = req.session.error;
    delete req.session.error;
    res.locals.message = "";
    if (err) {
        res.locals.message = '登陆验证：' + err;
    }
    if (res.locals.user) {
        Cart.count({uid: res.locals.user._id}, function (err, data) {

            if (!err) {
                res.locals.cartCount = data;
            }
            next();
        })
    } else {
        next();
    }

};

/**
 * 验证中间键
 */
exports.authenticateForAjax = function (req, res, next) {
    var isLogin = req.session && req.session.user;
    if (!isLogin) {
        res.locals.session = null;
        var redirectUrl = '';
        if (req.headers) {
            redirectUrl = req.headers.referer;
        }
        if (req.body && req.body.redirectUrl) {
            redirectUrl = req.body.redirectUrl;
        }
        return res.json({
            resultCode: -100,
            resultMsg: 'No Login!',
            redirectUrl: '/login?burl=' + redirectUrl
        });
    } else {
        res.locals.user = req.session.user;
        next();
    }

};
/*
 exports.localStrategy = new LocalStrategy(
 {usernameField: 'email', passwordField: 'passwd'},
 function (username, password, done) {
 // 可以配置通过数据库方式读取登陆账号
 User.getLoginUser(username, function (err, user) {
 if (err) {
 return done(null, false, {message: '获取用户信息失败'});
 }
 if (username !== user.username || password !== user.password) {
 return done(null, false, {message: '错误的用户或密码'});
 }
 return done(null, user);
 });

 //bcompare(password, hash, function(err, isMatch) {
 //  if (isMatch) {
 //    return done(null, user);
 //  } else {
 //    return done(null, false, { message: '密码不匹配' });
 //  }
 //});

 }
 );

 exports.authenticate = passport.authenticate('local', {
 successRedirect: '/userDemo',
 failureRedirect: '/'
 });

 //将req.isAuthenticated()封装成中间件
 exports.isLoggedIn = function (req, res, next) {
 if (req.isAuthenticated())
 return next();
 res.redirect('/');
 };

 exports.logginOut = function (req, res) {
 req.logout();
 res.redirect('/login');
 };

 var bcompare = function (str, hash, callback) {
 bcrypt.compare(str, hash, callback);
 };

 function gen_session(user, res) {
 var auth_token = user._id + '$$$$'; // 以后可能会存储更多信息，用 $$$$ 来分隔
 var opts = {
 path: '/',
 maxAge: 1000 * 60 * 60 * 24 * 30,
 signed: true,
 httpOnly: true
 };
 res.cookie(config.auth_cookie_name, auth_token, opts); //cookie 有效期30天
 }

 exports.gen_session = gen_session;*/
