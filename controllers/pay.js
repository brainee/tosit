/**
 * Created by DSC on 2015/11/17 0017.
 */
var directAlipay = require('direct-alipay');
var _ = require('lodash');
var proxy = require('../proxy');
var Order = proxy.Order;

directAlipay.config({
    seller_email: '53685478@qq.com',
    partner: '2088911275465084',
    key: 'tws3ri4d3sg8ohc4t7k9dnj8kumvia05',
    return_url: 'http://localhost:18080/pay/ali_pay_result'
});

exports.aliPay = function(req,res){
    if(req.params&&req.params.oid) {
        Order.getById(req.params.oid, function (err, data) {
            if (!err && data && data.uid == res.locals.user._id) {
                var subject = data.cart[0].items.product.subTitle;
                var body = "";
                _.forEach(data.cart, function (val) {
                    body += val.items.product.name;
                });
                if(body.length > 512){
                    body = body.substr(0,512);
                }
                var url = directAlipay.buildDirectPayURL({
                    out_trade_no: req.params.oid,
                    subject: subject,
                    body: body,
                    total_fee: data.price
                });
                res.render('pay/ali_pay', {
                    title: "支付",
                    data: url
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

}

exports.aliPayResult = function (req, res) {
    var params = req.query;
    alipay.verity(params, function (err, result) {
        if (err) {
            res.render('pay/ali_pay_result', {
                title: "出现错误",
                data: err
            })
        } else {
            if (result === true) {
                //res.reply('支付成功');
                //该通知是来自支付宝的合法通知
                Order.del(params.out_trade_no,function(err,data){
                    res.render('pay/ali_pay_result', {
                        title: "支付成功",
                        data: result
                    })
                });
            }else{
                res.render('pay/ali_pay_result', {
                    title: "支付失败",
                    data: result
                })
            }
        }
    });
    res.end('');
};