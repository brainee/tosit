/**
 * Created by lmmeng on 2015-10-19.
 * 预约控制器（需要登录）
 */
var moment = require('moment'),
    csv = require('csv'),
    model = require('../models'),
    reserveModel = model.Reserve,
    productModel = model.Product;

// -----产品预约-----

// 预约到店
exports.store = function (req, res) {
    var pid = req.params.pid;
    productModel.findOne({_id: pid}, function (err, data) {
        res.render("reserve/store", {
            title: "预约到店", product: data
        })
    });
};
// 上门量体
exports.visit = function (req, res) {
    var pid = req.params.pid;
    productModel.findOne({_id: pid}, function (err, data) {
        res.render("reserve/visit", {
            title: "上门量体", product: data
        })
    });
};
// 保存预约数据
exports.dataPost = function (req, res) {
    var data = req.body;
    data.phoneNumber = req.session.user.phone;
    reserveModel.create(req.body, function (err, result) {
        if (err) throw err;
        if (result) {
            res.send({state: 'ok', data: result});
        } else {
            res.send({state: 'fail', msg: '保存数据失败'});
        }
    });
};

// -----offline-----

// 数据管理列表
exports.manage = function (req, res) {
    var result = [];
    reserveModel.find({}, function (err, data) {
        data.forEach(function (e, i) {
            var t = e;
            t.appTime = moment(e.appointmentTime).format('YYYY-MM-DD HH:mm:ss');
            t.wedDate = moment(e.weddingDate).format('YYYY-MM-DD');
            t.create = moment(e.create_at).format('YYYY-MM-DD HH:mm:ss');
            result.push(t);
        });
        res.render('offline/reserve', {data: result});
    });
};
// 删除
exports.delete = function (req, res) {
    var id = req.params.id;
    reserveModel.remove({_id: id}, function (err, data) {
        if (err) {
            res.send('fail');
        } else {
            res.send('ok');
        }
    });
};
// 下载
exports.download = function (req, res) {
    var search = {};
    var query = reserveModel.find(search);
    query.sort('-createTime');
    query.exec(function (err, list) {
        if (err) {
            throw err;
        }
        else {
            var result = [], content = '';
            content += '用户名,手机,生日,年龄,婚期,区域,预约时间,预约渠道,备注,提交时间\r\n';
            list.forEach(function (e, i) {
                var t = e;
                t.appTime = moment(e.appointmentTime).format('YYYY-MM-DD HH:mm:ss');
                t.wedDate = moment(e.weddingDate).format('YYYY-MM-DD');
                t.birth = moment(e.birthday).format('YYYY-MM-DD');
                t.create = moment(e.create_at).format('YYYY-MM-DD HH:mm:ss');
                t.age = (e.birthday ? new Date().getYear() - new Date(t.birthday).getYear() : 0) + 1;
                content += t.userName + ',';
                content += t.phoneNumber + ',';
                content += t.birth + ',';
                content += t.age + ',';
                content += t.wedDate + ',';
                content += t.area + ',';
                content += t.appTime + ',';
                content += t.channel + ',';
                content += t.remark + ',';
                content += t.create;
                content += '\r\n';
            });
            var file = new Date().getTime();
            res.set({
                'Content-Type': 'text/csv',
                'Content-disposition': 'attachment;filename=' + encodeURIComponent(file) + '.csv',
                'Pragma': 'no-cache',
                'Expires': 0
            });
            var buffer = new Buffer(content);
            var iconv = require('iconv-lite');
            var str = iconv.encode(buffer, 'gb2312');
            res.send(str);

            //res.write(new Buffer('\xEF\xBB\xBF', 'binary'));//add utf-8 bom
            //csv().from.array(result).to(res);
            //csv.stringify(result).pipe(res);
        }
    })
};

/**
 * 预约档期设置
 * @description
 * 关于预约时间管理系统规则如下:
 * 工作时间: 周一至周日 10:00~22:00
 * 接待时段：3个客户/30分钟
 * TODO：等客户确认是否需要做该功能
 */
exports.schedule = function (req, res) {
    res.render('offline/reserve/set', {title: '预约档期配置'});
};
exports.schedulePost = function (req, res) {

};
// 预约档期验证中间键
exports.check = function (req, res, next) {
    next();
};
