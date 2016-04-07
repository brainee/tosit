/*!
 * web_router.js
 * Created by alex<lex.meng@qq.com> on 15/8/31.
 * 前台路由
 */
var express = require('express'),
    router = express.Router();
// controllers
var utils       = require('./controllers/utils'),
    home        = require('./controllers/home'),
    users       = require('./controllers/users'),
    orders      = require('./controllers/orders'),
    accounts    = require('./controllers/accounts'),
    products    = require('./controllers/products'),
    activities  = require('./controllers/activities'),
    reserve     = require('./controllers/reserve'),
    lands       = require('./controllers/lands'),
    category    = require('./controllers/category'),
    style       = require('./controllers/style'),
    content     = require('./controllers/content'),
    pay         = require('./controllers/pay');

// 中间键
var auth = require('./middlewares/auth');

router.get('/sms', utils.sendSms);

// 首页
router.get('/', home.index);
router.get('/about/:key', content.getOne);

// 产品
router.get(['/product','/product/index'], products.index);
router.post('/product/list', products.list);
router.get('/product/productInfo/:pid', products.getProductById);
router.get('/product/:pid', products.detail);
router.get('/json/attr', products.attr);
router.get('/json/category', category.get);
router.get('/json/style', style.get);

// 订单
//router.get('/order/:pid', orders.addCart);
router.post('/order/addorder', auth.authenticateForAjax, orders.add);
router.post('/order/del', auth.authenticateForAjax, orders.del);
router.get('/pay/aliPay/:oid',auth.userRequired,pay.aliPay);
router.get('/pay/ali_pay_result',auth.userRequired,pay.aliPayResult)
// 产品预约
//router.get('/visitForm', products.visitForm);
router.get('/reserve/*/:pid', auth.userRequired, reserve.check); //先验证登陆，后验证预约是否有档期
router.get('/reserve/store/:pid', reserve.store); // 上门量体
router.get('/reserve/visit/:pid', reserve.visit); // 预约到店
router.post(['/reserve/store','/reserve/visit'], reserve.dataPost);

// 活动预约
router.get('/appointment', lands.appointment); // 兼容之前的预约入口
router.get('/lands/input10001', lands.input10001);
router.post('/lands/input10001', lands.post10001);

// 会员中心
router.all('/user/*', auth.userRequired);
router.get('/user', users.index); // 会员中心
router.get('/user/orders', users.orders); // 会员订单
router.get('/user/orders_check',auth.userRequired ,users.ordersCheck); // 核对订单
router.get('/user/orders_check/:oid',auth.userRequired, users.ordersCheck); // 核对订单
router.get('/user/record', users.record); // 穿衣人档案
router.get('/user/info', users.info); // 账户信息
router.post('/user/info', users.infopost); // 账户信息
router.get('/user/appointments', users.appointments); // 会员预约单
router.get('/user/changing_room', users.changingRoom); // 试衣间
router.post('/user/add_cart/:pid', auth.authenticateForAjax, users.addCart); // 加入购物车
router.post('/user/remove_carts', auth.userRequired, users.removeCarts); // 加入购物车

// 会员中心 - 账号管理
router.get('/user/setting', auth.userRequired, accounts.index); // 账号设置
router.get('/user/change_pwd', accounts.changePwd); // 修改密码
router.post('/user/change_pwd', accounts.changePwdPost); // 修改密码

// 账号
//router.get('/reg', accounts.reg); // 注册
router.post('/reg', accounts.regPost); // 注册
router.post('/reg_check', accounts.regCheck); // 注册验证
router.get('/login', accounts.login); // 登录
router.post('/login', accounts.loginPost);
router.get('/logout', accounts.logout);
router.get('/find', accounts.findPwd); // 修改密码
router.post('/find', accounts.findPwdPost); // 修改密码
router.get('/check_login', accounts.checkLogin);

module.exports = router;
