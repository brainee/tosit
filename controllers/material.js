/**
 * Created by alex on 15/9/16.
 */
var EventProxy = require('eventproxy'),
    moment = require('moment'),
    proxy = require('../proxy'),
    tools = require('../lib/tools'),
    User = proxy.User,
    materialProxy = proxy.Material,
    categoryProxy = proxy.Category;

// offline
/**
 * 产品物料管理
 */
exports.manage = function (req, res) {
    var ep = new EventProxy(),
        key = req.params.key;
    ep.all('categories', 'materials', 'material', function (categories, materials, material) {
        res.render('offline/material', {
            key: key, categories: categories, materials: materials, material: material
        });
    });
    categoryProxy.getAll(ep.done('categories'));
    materialProxy.getAll(ep.done('materials'));
    materialProxy.getList({category: key}, function (err, data) {
        tools.formatList(data);
        ep.emit('material', data);
    });
};
exports.detail = function (req, res) {
    var key = req.params.key;
    if (key) {
        materialProxy.getList({category: key}, function (err, data) {
            if (!err) {
                res.send(data);
            } else {
                res.send(err);
            }
        });
    }
    else {
        res.send('fail');
    }
};
exports.addPost = function (req, res) {
    materialProxy.add(req.body, function (err, data) {
        //console.log(data);
        if (!err && data) {
            res.send({status: 'ok', data: data});
        } else {
            res.send({status: 'fail', msg: '添加数据错误！\n' + err});
        }
    });
};
exports.editPost = function (req, res) {
    var id = req.params.id;
    materialProxy.edit(id, req.body, function (err, data) {
        if (!err && data && data > 0) {
            res.send({status: 'ok', data: data});
        } else {
            res.send({status: 'fail', msg: '修改数据错误！\n' + err});
        }
    });
};
exports.delPost = function (req, res) {
    var id = req.params.id;
    materialProxy.del(id, function (err, data) {
        if (!err && data && data > 0) {
            res.send({status: 'ok', data: data});
        } else {
            res.send({status: 'fail', msg: '删除数据错误！\n' + err});
        }
    });
};
// 物料子项
exports.items = function (req, res) {
    var key = req.params.key,
        id = req.params.id;
    if (key) {
        materialProxy.getOne({category: key, _id: id}, function (err, data) {
            if (!err) {
                res.render('offline/material/item', {key: key, data: data});
            } else {
                res.render('error', err);
            }
        });
    }
    else {
        res.send({status: 'fail', msg: '传入参数key不可为空！\n' + err});
    }
};
exports.editItemPost = function (req, res) {
    var ep = new EventProxy(),
        key = req.params.key,
        id = req.params.id,
        dir = './public/upload/product/mate-icon';
    if (key && id) {
        materialProxy.getOne({category: key, _id: id}, ep.done('getOne'));
        // upload icon
        tools.uploadImage(dir, req, function (url, thumbUrl, fields) {
            var item = {index: fields.index, name: fields.name, icon: url};
            ep.emit('upload', item);
        });

        ep.all('getOne', 'upload', function (one, item) {
            var items = one.items || [];
            if (item.index == -1) {
                items.push(item);
            } else {
                items[item.index] = item;
            }
            materialProxy.edit(id, {items: items}, function (err, data) {
                if (!err && data > 0) {
                    res.render('offline/material/item', {key: key, data: one});
                } else {
                    res.render('error', err);
                }
            });
        });
    }
    else {
        res.send({status: 'fail', msg: '传入参数不可为空！\n' + err});
    }
};
exports.delItemPost = function (req, res) {
    var ep = EventProxy.create(),
        key = req.params.key,
        id = req.params.id,
        itemid = req.body.itemid,
        index = req.body.index;
    //console.log('itemid:' + itemid + '\nindex:' + index + '\nid:' + id);
    if (key && id) {
        materialProxy.getOne({category: key, _id: id}, ep.done('getOne'));
        ep.once('getOne', function (one) {
            var items = one.items || [];
            //console.log("=======items begin=======\n"+items);
            items.splice(index, 1);
            //console.log("=======items end=======\n"+items);
            materialProxy.edit(id, {items: items}, function (err, data) {
                if (!err && data && data > 0) {
                    res.send({status: 'ok', data: data});
                } else {
                    res.send({status: 'fail', msg: '修改数据错误！\n' + err});
                }
            });
        })
    }
};

