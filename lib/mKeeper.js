/**
 * Created by alex on 15/7/30.
 * 由于百度云不支持Mongdb长连接，所以使用该方案模拟一个连接池。
 */
var mongoose = require('mongoose');
var util = require("util");

function MongooseKeeper() {
    this.db = mongoose.createConnection();
    this.open_count = 0;
    // 链接错误
    this.db.on('error', function (error) {
        console.log(error);
    });
}
MongooseKeeper.prototype.config = function (conf) {
    // body...
    var options = {
        db: {native_parser: true},
        server: {
            poolSize: 4
        }
    };

    var constr = "";
    if (process.env.MONGO_DB_STR) {
        constr = process.env.MONGO_DB_STR;
    }
    else {
        //'mongodb://user:pass@localhost:port/database'
        constr = util.format('mongodb://%s:%s@%s:%d/%s', conf.userid, conf.password, conf.host, conf.port, conf.database);
    }
    this.dbUri = constr;
    this.options = options;

}
MongooseKeeper.prototype.open = function () {
    this.open_count++;
    if (this.open_count == 1 && this.db.readyState == 0) {
        this.db.open(this.dbUri, this.options, function () {
            console.log("\ndb opened");
        });
    }
}
MongooseKeeper.prototype.close = function () {
    this.open_count--;
    if (this.open_count == 0) {
        this.db.close(function () {
            console.log("db closed\n");
        });
    }
}
MongooseKeeper.prototype.use = function (action, callback) {
    //OPEN
    var self = this;
    self.open();
    action.call(null, function () {
        //CLOSE
        console.log("正在访问的数据库请求量" + self.open_count);
        self.close();
        if (callback && typeof callback === 'function') {
            callback.apply(null, arguments);
        }
        //DONE
        self = null;
    })
};

exports = module.exports = new MongooseKeeper();
