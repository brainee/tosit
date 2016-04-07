/**
 * Created by alex on 15/8/31.
 */
var path = require('path');

var config = {
    // debug 为 true 时，用于本地调试
    debug: process.env.NODE_ENV == 'development',
    description: '极尚万服',
    session_secret: 'appid7qfb2yld0y_secret', // 务必修改
    auth_cookie_name: 'meldor_jswf',
    // mongodb
    //db: {
    //    host: "mongo.duapp.com",
    //    userid: "940244fb526248b799ce6faeb5909e18",
    //    password: "b18924ebed884f86bda697686a30fd03",
    //    database: "hBFevuSXTZzxDTgckXdd",
    //    port: "8908"
    //},
    db: 'mongodb://127.0.0.1/meldor',
    // redis 配置，默认是本地
    redis: {
        host: '127.0.0.1',
        port: 6379,
        db: 0
    }
};
module.exports = exports = config;
