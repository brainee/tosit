/**
 * Created by alex on 15/9/1.
 */

var EventProxy = require('eventproxy'),
    multiparty = require('multiparty'),
    util = require('util'),
    fs = require('fs'),
    gm = require('gm'),
    _ = require('underscore'),
    proxy = require('../proxy'),
    productProxy = proxy.Product,
    categoryProxy = proxy.Category,
    styleProxy = proxy.Style,
    materialProxy = proxy.Material,
    tools = require('../lib/tools'),
    categoryController = require('./category'),
    styleController = require('./style');

// 前台
var getYears = function () {
    var years = [],
        list = [],
        start = new Date().getFullYear(),
        step = 5;
    for (var i = 0; i <= step * 2; i++) {
        var year = start - step + i;
        years.push(year);
        list.push({key: year, name: year});
    }
    return {year: years, list: list};
};
var getList = function (criteria, filter) {
    var ep = new EventProxy(),
        data = {};
    ep.all('list', 'category', 'style', function (list, category, style) {
        tools.formatList(list);
        data = {
            data: list, cats: [
                {cat: "分类", type: 'category', list: category}, //categoryController.mock.list},
                {cat: "风格", type: 'style', list: style},//styleController.mock.list},
                {
                    "cat": "时间",
                    "list": [
                        {"name": "2012", "link": "javascript:;"},
                        {"name": "2013", "link": "javascript:;"},
                        {"name": "2014", "link": "javascript:;"},
                        {"name": "2015", "link": "javascript:;"}
                    ]
                }
            ]
        };
    });
    productProxy.getProductList(criteria, filter, ep.done('list')); //首屏加载
    categoryProxy.getAll(ep.done('category'));
    styleProxy.getAll(ep.done('style'));
    return data;
};
/**
 * 产品首页
 */
exports.index = function (req, res) {
    //var list = getList({},{page:1, pageSize:9});//首屏加载
    //res.render('product',list);

    var ep = new EventProxy(),
        _page = 1,
        _pageSize = 9,
        key = "";

    ep.all('list', 'count', 'category', 'style', function (list, count, category, style) {
        tools.formatList(list);
        res.render('product', {
            title: '产品列表页',
            data: list,
            key: key,
            count: count,
            page: _page,
            pageSize: _pageSize,
            cats: [
                {cat: "分类", type: 'category', list: category}, //categoryController.mock.list},
                {cat: "风格", type: 'style', list: style},//styleController.mock.list},
                {
                    "cat": "时间",
                    "type": 'year',
                    "list": getYears().list
                }
            ]
        });
    });

    // 筛选条件
    var criteria = {};
    if (req.query.t && req.query.cat) {
        //console.log('type: ' + req.query.t);
        //console.log('cat: ' + req.query.cat);
        switch (req.query.t) {
            case 'category':
                criteria.categories = req.query.cat;
                break;
            case 'style':
                criteria.styles = req.query.cat;
                break;
            case 'year':
                criteria.year = req.query.cat;
                break;
            default :
                break;
        }
    }

    // 搜索关键词
    if (req.query.key) {
        key = req.query.key;
        criteria.name = eval('/' + key + '/');
    }

    productProxy.getProductList2(criteria, {page: _page, pageSize: _pageSize}, ep.done('list')); //首屏加载
    productProxy.instance.count(criteria, ep.done('count'));
    categoryProxy.getAll(ep.done('category'));
    styleProxy.getAll(ep.done('style'));
};
/**
 * 产品列表（非首屏Ajax请求）
 */
exports.list = function (req, res) {
    var page = req.body.page || 1,
        pageSize = req.body.pageSize || 9,
        category = req.body.category || '',
        style = req.body.style || '',
        name = req.body.key || '',
        year = req.body.year || '';

    // 筛选条件
    var criteria = {};

    if (category !== '') {
        criteria.categories = category;
    }

    if (style !== '') {
        criteria.styles = style;
    }

    if (name !== '') {
        criteria.name = eval('/' + name + '/');
    }

    if (year !== '') {
        criteria.year = year;
    }

    productProxy.getProductList2(
        criteria,
        {page: page, pageSize: pageSize},
        function (err, data) {
            tools.formatList(data);
            res.send(data);
        });
};
/**
 * 产品详情
 */
exports.detail = function (req, res, next) {
    var id = req.params.pid,
        ep = EventProxy.create();
    productProxy.instance.getById(id, function (err, data) {
        if (err) {
            return ep.emitLater('error', err);
        }
        ep.emitLater('product', data);
    });
    ep.once('product', function (data) {
        materialProxy.getList({category:  data.categories}, function (err2, data2) {
            //console.log('====materials====\n' + data2);
            if (err2) next(err2);
            res.render("detail", {title: "产品详情页 - " + data.name, data: data, materials: data2});
        });
    });
};
/**
 * 根据ID获取单个产品
 */
exports.getProductById = function (req, res) {
    var id = req.params.pid;
    productProxy.instance.getById(id, function (err, data) {
        res.json({data: data});
    });
};
/**
 * 复合产品分类和风格
 */
exports.attr = function (req, res) {
    //res.json([
    //    {cat: "分类", type: 'category', list: categoryController.mock.list},
    //    {cat: "风格", type: 'style', list: styleController.mock.list},
    //    {cat: "时间", type: 'year', "list": getYears().list}
    //]);
    var ep = new EventProxy();
    ep.all('category', 'style', function (category, style) {
        res.json([
            {cat: "分类", type: 'category', list: category},
            {cat: "风格", type: 'style', list: style},
            {cat: "时间", type: 'year', "list": getYears().list}
        ]);
    });
    categoryProxy.getAll(ep.done('category'));
    styleProxy.getAll(ep.done('style'));
};

// offline后台
/**
 * 产品管理列表
 */
exports.manage = function (req, res) {
    productProxy.getProductList({}, function (err, data) {
        tools.formatList(data);
        res.render('offline/products', {data: data});
    });
};
/**
 * 产品新增、修改(页面渲染)
 */
exports.edit = function (req, res) {
    var ep = new EventProxy(),
        id = req.params.id;
    ep.all('detail', 'category', 'style', 'material',
        function (data, category, style, material) {
            res.render('offline/products/edit',
                {
                    data: data,
                    categories: category,//categoryController.mock.list,
                    styles: style, //styleController.mock.list,
                    years: getYears().list,
                    materials: material
                });
        });
    if (id) {
        productProxy.instance.getById(id, function (err, data) {
            ep.emit('detail', data);
        });
    } else {
        ep.emit('detail', undefined);
    }
    categoryProxy.getAll(ep.done('category'));
    styleProxy.getAll(ep.done('style'));
    materialProxy.getAll(ep.done('material'));
};
/**
 * 新增
 */
exports.addPost = function (req, res) {
    productProxy.createProduct(req.body, function (err, data) {
        tools.simpleCallback(err, data, res);
    });
};
/**
 * 修改
 */
exports.editPost = function (req, res) {
    productProxy.editProduct({_id: req.params.id}, req.body, function (err, data) {
        tools.simpleCallback(err, data, res);
    });
};
/**
 * 删除
 */
exports.delPost = function (req, res) {
    productProxy.delProduct({_id: req.params.id}, function (err, data) {
        tools.simpleCallback(err, data, res);
    });
};
/**
 * 上传图片
 */
exports.image = function (req, res) {
    var id = req.params.id;
    productProxy.getProductById(id, function (err, data) {
        res.render('offline/products/image', {data: data});
    });
};
exports.imagePost = function (req, res) {
    var ep = new EventProxy(),
        id = req.params.id;
    ep.all('images', 'product', function (images, product) {
        if (images && product) {
            var data = product.images = product.images.concat(images);
            productProxy.editProduct({_id: id}, {images: data}, function (err, data) {
                if (!err && data > 0) {
                    res.render('offline/products/image', {data: product});
                } else {
                    res.send('fail');
                }
            });
        }
    });
    productProxy.getProductById(id, ep.done('product'));
    var images = [];
    tools.uploadImage('./public/upload/product/', req, function (tmp_path, thumb_path) {
        //console.log('replace:' + tmp_path);
        var image = {
            type: 'product',
            url: tmp_path,
            thumbUrl: thumb_path,
            alt: '',
            sort: 0
        };
        images.push(image);
        ep.emit('images', images);
    });
};
/**
 * 删除产品图片
 */
exports.delImagePost = function (req, res) {
    var ep = new EventProxy(),
        id = req.params.id,
        imgId = req.body.imgId;

    productProxy.getProductById(id, function (err, data) {
        var image = data.images.id(imgId);
        if (image) {
            image.remove();
            data.save(function (err, data) {
                //最好的做法删除图片的同时删掉图片文件
                //var file = './public' + image.url;
                //if (fs.existsSync(file)) {
                //    fs.unlink(file, function (err) {
                //        if (err) {
                //            console.log(err);
                //        } else {
                //            console.log('unlink:' + file);
                //        }
                //    })
                //}
                tools.simpleCallback(err, data, res);
            });
        }
    });
};

exports.material = function (req, res) {
    var id = req.params.id;
    productProxy.getProductById(id, function (err, data) {
        res.render('offline/products/material', {data: data});
    });
};
exports.materialPost = function (req, res) {

};
exports.delMaterialPost = function (req, res) {

};
// 暂存不用
exports.imagePost2 = function (req, res) {
    var form = new multiparty.Form({uploadDir: './public/upload/product/'});
    var ep = new EventProxy();
    var id = req.params.id;
    var images = [];

    ep.all('images', 'product', function (upload, product) {
        if (upload && product) {
            product.images.push(upload);
            //imageProxy.add(upload, function (err, data) {
            //    res.send(data);
            //});
            productProxy.editProduct(id, {images: product.images}, function (err, data) {
                if (!err && data > 0) {
                    res.render('offline/products/image', {data: product.images});
                } else {
                    res.send('fail');
                }
            });
        }
    });
    productProxy.getProductById(id, ep.done('product'));

    ep.after('upload_file', body.count, function (list) {
        ep.emit('images', list);
    });
    // 上传部分
    form.on('file', function (name, file) {
        if (file.size == 0) {
            ep.emit('images', null);
            return;
        }
        var fileName = (new Date()).getTime();
        var tmp_path = file.path;
        var target_path = './public/upload/product/' + fileName + '.png';
        var thumbPath = './public/upload/product/thumbs/' + fileName + '.png';

        //res.redirect('/upload/product/' + fileName);
        //console.log(target_path);

        fs.renameSync(tmp_path, target_path, function (err) {
            if (err) console.error(err.stack);
        });

        var image = {
            type: 'product',
            url: target_path,
            thumbUrl: '',
            alt: '',
            sort: 0
        };
        images.push(image);
        ep.emit('upload_file', image);

        //ep.emit('images', images);
    });
    form.parse(req);
};
exports.imagePost1 = function (req, res) {
    var count = 0;
    var form = new multiparty.Form({
        uploadDir: './public/upload/product/',
        autoFields: true,
        autoFiles: false
    });

    // Errors may be emitted
    // Note that if you are listening to 'part' events, the same error may be
    // emitted from the `form` and the `part`.
    form.on('error', function (err) {
        console.log('Error parsing form: ' + err.stack);
    });

    // Parts are emitted when parsing the form
    form.on('part', function (part) {
        // You *must* act on the part by reading it
        // NOTE: if you want to ignore it, just call "part.resume()"

        if (!part.filename) {
            // filename is not defined when this is a field and not a file
            console.log('got field named ' + part.name);
            // ignore field's content
            part.resume();
        }

        if (part.filename) {
            // filename is defined when this is a file
            count++;
            console.log('got file named ' + part.name);
            // ignore file's content here
            part.resume();
        }

        part.on('error', function (err) {
            // decide what to do
        });
    });
    form.on('file', function (name, file) {
        console.log('\nname:' + name + ' \nfile:' + file.toString());
    });
    form.on('field', function (name, value) {
        console.log('\nname:' + name + ' \nfield:' + value.toString());
    });

    // Close emitted after form parsed
    form.on('close', function () {
        console.log('Upload completed!');
        //res.setHeader('text/plain');
        res.end('Received ' + count + ' files');
    });

    // Parse req
    form.parse(req);

    /*form.parse(req, function(err, fields, files) {
     Object.keys(fields).forEach(function(name) {
     console.log('got field named ' + name);
     });

     Object.keys(files).forEach(function(name) {
     console.log('got file named ' + name);
     });

     console.log('Upload completed!');
     //res.setHeader('text/plain');
     res.end('Received ' + files.length + ' files');
     });*/
};
