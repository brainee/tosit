var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');

var webRouter = require('./web_router');
var offlineRouter = require('./offline_router');
//var lands = require('./routes/lands');
//var utils = require('./routes/utils');

//passport必要组件引用
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var flash = require('express-flash');
var passport = require('passport');
var ueditor = require('ueditor');
var auth = require('./middlewares/auth');
var ue = require('./middlewares/ueditor');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
  secret: '12345',
  name: 'moldor',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
  cookie: {maxAge: 30 * 60000},  //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
  resave: false,
  saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use("/ueditor/ue", ueditor(path.join(__dirname, 'public'), ue.ueditor));
//登录拦截器
app.use(auth.authenticate);
require('./middlewares/mongoose_log'); // 打印 mongodb 查询日志

//下面是passportjs的中间件引用
//app.use(passport.initialize());
//app.use(passport.session());
app.use(flash());

//passport.use('local', auth.localStrategy);
//passport.serializeUser(function (user, done) {
//  done(null, user.username);
//});
//
//passport.deserializeUser(function (username, done) {
//  done(null, {username: username});
//});

// home
//app.use('/lands', lands);
//app.use('/utils', utils);
app.use('/', webRouter);
app.use('/offline', offlineRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
