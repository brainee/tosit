/**
 * Created by alex on 15/8/31.
 */
var proxy = require('../proxy'),
    userProxy = proxy.User;
exports.index = function(req,res,next){
  res.render('offline/index', {
    title: '首页'
  });
};
exports.login = function(req,res,next){
  res.render('offline/login');
};
exports.loginPost = function (req, res) {
    var loginname = req.body.username,
        password = req.body.password;
    userProxy.getLoginUser(loginname, function (err, data) {
       if(!err && data && data.password == password){
           res.render('offline');
       }else{
           res.render('offline/login',{error: 'fail'});
       }
    });
};
exports.logout = function(req,res,next){
  res.render('offline/login');
};
exports.settings = function(req,res,next){
  res.render('offline/settings');
};
