/**
 * Created by alex on 15/9/3.
 */
var mongoose = require('mongoose');
var conf = require('../config');
if (process.env.NODE_ENV === 'development') {
    conf = require('../config.test');
}
//var keeper = require('../lib/mKeeper');
//keeper.config(conf.db);
mongoose.connect(conf.db, {
    server: {poolSize: 20}
}, function (err) {
    if (err) {
        console.error('connect to %s error: ', conf.db, err.message);
        process.exit(1);
    }
});

// models
require('./user'); // 用户
require('./ads'); // 广告
require('./product'); // 产品
require('./material'); // 产品物料
require('./order'); // 订单
require('./integral'); // 积分
require('./content'); // 内容模块（关于我们/品牌介绍...)
require('./image'); // 图片（首页轮播）
require('./banner'); // 首页轮播
require('./reserve'); //预约
require('./cart'); //购物车
require('./order');//订单

//桥接keeper组件，方便将来切换长连接写法
//exports.flush = function (action,callback) {
//  keeper.use(action,callback);
//};
//exports.Keeper = keeper;
exports.User            = mongoose.model('User');
exports.Product         = mongoose.model('Product');
exports.ProductCategory = mongoose.model('ProductCategory');
exports.ProductStyle    = mongoose.model('ProductStyle');
exports.ProductMaterial = mongoose.model('ProductMaterial');
exports.ProductImage    = mongoose.model('ProductImage');
exports.Ads             = mongoose.model('Ads');
exports.Content         = mongoose.model('Content');
exports.Image           = mongoose.model('Image');
exports.Banner          = mongoose.model('Banner');
exports.Reserve         = mongoose.model('Reserve');
exports.Cart            = mongoose.model('Cart');
exports.Order           = mongoose.model('Order');