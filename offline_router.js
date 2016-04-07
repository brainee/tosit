/*!
 * web_router.js
 * Created by alex<lex.meng@qq.com> on 15/8/31.
 */
// util tools
//var utils = require('./routes/utils');
// landing page
//var lands = require('./routes/lands');
// controllers
var home = require('./controllers/home');
var users = require('./controllers/users');
var orders = require('./controllers/orders');
var accounts = require('./controllers/accounts');
var products = require('./controllers/products');
var activities = require('./controllers/activities');
var reserve = require('./controllers/reserve');
var banner = require('./controllers/banner');

// offline page
var offline = require('./controllers/offline'),
    category = require('./controllers/category'),
    style = require('./controllers/style'),
    material = require('./controllers/material'),
    content = require('./controllers/content');

var path = require('path');
var ueditor = require('ueditor');
// 中间键
var auth = require('./middlewares/auth');
var ue = require('./middlewares/ueditor');

var express = require('express');
var router = express.Router();

router.all('/*', auth.adminRequired);
// offline home page
router.get(['/', '/index'], offline.index);
//router.get('/offline', offline.index);
router.get('/login', accounts.login);
router.post('/login', accounts.loginPost);
router.get('/logout', accounts.logout);
router.get('/settings', offline.settings);

// 产品相关
router.get(['/products', '/products/index'], products.manage);
router.get(['/products/add', '/products/edit', '/products/edit/:id'], products.edit);
router.post('/products/add', products.addPost);
router.post('/products/edit/:id', products.editPost);
router.post('/products/del/:id', products.delPost);
router.get('/products/image/:id', products.image);
router.post('/products/image/:id', products.imagePost);
router.post('/products/image/:id/del', products.delImagePost);
router.get('/products/material/:id', products.material);
router.post('/products/material/:id', products.materialPost);
router.post('/products/material/:id/del', products.delMaterialPost);

// 产品类别
router.get(['/category', '/category/index'], category.manage);
router.post('/category/add', category.add);
router.post('/category/edit/:id', category.edit);
router.post('/category/del/:id', category.delete);

// 产品风格
router.get('/style', style.manage);
router.post('/style/add', style.add);
router.post('/style/edit/:id', style.edit);
router.post('/style/del/:id', style.delete);

// 产品物料
router.get(['/material','/material/:key'], material.manage);
router.get('/material/detail/:key', material.detail);
router.post('/material/add', material.addPost);
router.post('/material/edit/:id', material.editPost);
router.post('/material/del/:id', material.delPost);

router.get('/material/:key/items/:id', material.items);
router.post('/material/:key/items/:id', material.editItemPost);
router.post('/material/:key/items/del/:id', material.delItemPost);


// 用户相关
router.get(['/users', '/users/index'], users.manage);
router.get(['/users/detail/:id', '/users/edit/:id'], users.detail);
router.get('/users/edit/:id', users.detail);
router.post('/users/edit/:id', users.editPost);
router.post('/users/del/:id', users.editPost); //逻辑删除
//router.post('/users/del/:id', users.delPost);

// 订单相关
router.get('/orders', orders.manage);
router.post('/orders', orders.manage);
router.get('/orders/download', orders.download);

// 活动相关
router.get('/activities', activities.manage);

// 预约相关
router.get('/reserves', reserve.manage);
router.post('/reserves/del/:id', reserve.delete);
router.get('/reserves/download', reserve.download);
router.get('/reserves/set', reserve.schedule);
router.post('/reserves/set', reserve.schedulePost);

// 图文内容相关
router.get(['/content', '/content/index'], content.manage);
router.get(['/content/edit', '/content/edit/:key'], content.detail);
router.post(['/content/edit', '/content/edit/:key'], content.editPost);
router.post('/content/del/:id', content.delete);

// 首页图片轮播
router.get(['/banner','/banner/index'], banner.manage);

module.exports = router;
