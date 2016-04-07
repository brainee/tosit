/**
 * Created by alex on 15/9/20.
 */
var tools = require('../lib/tools'),
    proxy = require('../proxy'),
    Content = proxy.Content,
    EventProxy = require('eventproxy');

exports.getOne = function (req, res) {
    var key = req.params.key;
    var ep = new EventProxy();

    if (key) {
        ep.all('one', 'keys', function (one, keys) {
            res.render('about', {data: one, keys: keys});
        });
        Content.getContentByKey(key, function (err, result) {
            ep.emit('one',result);
        });
        Content.getKeys(function (err, keys) {
            ep.emit('keys',keys);
        });
    }
    else {
        res.status(404).send('fail');
    }
};

exports.manage = function (req, res) {
    Content.getContentList({}, function (err, data) {
        tools.formatList(data);
        res.render('offline/contents',{data:data});
    });
};
exports.detail = function (req, res) {
    var key = req.params.key;
    if (key) {
        Content.getContentByKey(key, function (err, result) {
            if (result) {
                res.render('offline/contents/edit', {data: result});
            } else {
                res.render('offline/contents/edit');
            }
        });
    } else {
        res.render('offline/contents/edit');
    }
};
exports.editPost = function (req, res) {
    var data = req.body,
        key = req.params.key;
    if (data) {
        if (key) {
            Content.editContent({key: data.key}, data, function (err, result) {
                if (!err && result) {
                    res.send('ok');
                }else{
                    res.send('fail');
                }
            });
        } else {
            Content.createContent(data, function (err, result) {
                if (!err && result) {
                    if (!err && result) {
                        res.send('ok');
                    }else{
                        res.send('fail');
                    }
                }
            });
        }
    }
};
exports.delete = function (req, res) {
    Content.delContent({_id: req.params.id}, function (err, data) {
        if(err){
            res.send('fail');
        }else{
            res.send('ok');
        }
    });
}
