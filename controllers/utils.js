/**
 * Created by alex on 15/10/20.
 */
var smsModel = require('../lib/sms');

// 生成随机码
var randomNumFn = function (n) {
    var charactors = "1234567890";
    var value = '', i;
    for (j = 1; j <= n; j++) {
        i = parseInt(10 * Math.random());
        value = value + charactors.charAt(i);
    }
    return value;
};

exports.randomNum = randomNumFn;
// 发送短信
exports.sendSms = function (req, res) {
    var randomNum = randomNumFn(4),
        mobile = req.body.mobile;
    if (!randomNum) {
        res.send({state: 'fail', randomNum: randomNum});
        return;
    }
    var storeInfo = {
        mobile: mobile,
        vcode: randomNum,
        time: new Date()
    };
    req.session[mobile] = storeInfo;
    if (process.env.NODE_ENV === 'development') {
        console.log(storeInfo);
    } else {
        smsModel.send(req.body.mobile, '亲爱的用户，您的验证码是：' + randomNum + ', 请在5分钟内使用。');
    }
    //res.send({state: 'ok', randomNum: randomNum});
};

// 发送邮件

// csv导出
