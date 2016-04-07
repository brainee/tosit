/**
 * Created by alex on 15/8/31.
 */
var path = require('path');

var config = {
    // debug 为 true 时，用于本地调试
    debug: true,
    description: '极尚万服',
    session_secret: 'appid7qfb2yld0y_secret', // 务必修改
    auth_cookie_name: 'meldor_jswf',
    // mongodb
    //db: 'mongodb://www.chunhigh.com/meldor',
    db: 'mongodb://127.0.0.1/meldor',
    // redis 配置，默认是本地
    redis: {
        host: '127.0.0.1',
        port: 6379,
        db: 0
    }
};
module.exports = config;
