/**
 * Created by alex on 15/7/30.
 */
var http = require('http');
var qs = require('querystring');

function SMS() {}

SMS.prototype.send = function (mobile, msg) {
    var options = {
        hostname: "222.73.117.158",
        port: 80,
        path: "/msg/HttpBatchSendSM",
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
    };
    var post_data = {
        account: "jishangwf",//账号
        pswd: "Txb123456",//密码
        mobile: mobile, //手机号码，多个号码使用","分割
        msg: msg,//"亲爱的用户，您的验证码是123456，5分钟内有效。",//短信内容
        needstatus: true//是否需要状态报告，需要true，不需要false
    };//这是需要提交的数据
    var content = qs.stringify(post_data);
    var req = http.request(options, function (res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
        });
    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });

    // write data to request body
    req.write(content);
    req.end();
};

exports = module.exports = new SMS();