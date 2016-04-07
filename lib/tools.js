var moment = require('moment'),
    fs = require('fs'),
    multiparty = require('multiparty');

moment.locale('zh-cn'); // 使用中文

// 格式化时间
exports.formatDate = function (date, friendly) {
    date = moment(date);

    if (friendly) {
        return date.fromNow();
    } else {
        return date.format('YYYY-MM-DD HH:mm:ss');
    }
};

exports.formatList = function (list, format) {
    var _format = format || 'YYYY-MM-DD HH:mm:ss';
    list.forEach(function (e, i) {
        e.create = moment(e.create_at).format(_format);
        e.update = moment(e.update_at).format(_format);
    });
};

exports.uploadImage = function (dir, req, callback) {
    fs.exists(dir, function (exists) {
        if (!exists) {
            fs.mkdir(dir, function (err) {
                if (err) console.error(err);
                else console.log('创建文件夹：' + dir);
            });
        }

        var form = new multiparty.Form({uploadDir: dir});
        form.parse(req, function (err, fields, files) {
            if (err) {
                console.log('parse error: ' + err);
            } else {
                for (var key in files) {
                    if (files[key] && files[key].length > 0) {
                        for (var i = 0; i < files[key].length; i++) {
                            var file = files[key][i];
                            var tmp_path = file.path.replace(/public/, '');
                            // TODO:产生缩略图
                            var thumb_url = tmp_path.replace(/product/, 'product/thumbs');
                            callback(tmp_path, thumb_url, fields);
                        }
                    }
                }
            }
        });

    });
};

exports.validateId = function (str) {
    return (/^[a-zA-Z0-9\-_]+$/i).test(str);
};

// 设置左侧菜单 高亮
exports.setSideMenuCurrent = function (n) {

};

// 简单回调处理
exports.simpleCallback = function (err, data, res) {
    if (!err && data) {
        res.send('ok');
    } else {
        res.send('fail');
        console.error("simpleCallback: \n" + err);
    }
};
