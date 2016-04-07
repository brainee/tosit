/**
 * Created by alex on 15/7/27.
 */
// mongoose 链接
var mongoose = require('mongoose'),
    global = require('./global'),
    debug = require('debug')('appid7qfb2yld0y:Model'),
    connectStr = global.mongodb,
    db = mongoose.createConnection(connectStr);

// 链接错误
db.on('error', function(error) {
    console.log(error);
});

function Model(schema, collection) {
    debug('connectStr: ' + connectStr);
    this.schema = new mongoose.Schema(schema);
    this.collection = collection;
    this.model = db.model(this.collection, this.schema);
}

Model.prototype = {
    final: function (error) {
        if (error) {
            console.log(error);
        } else {
            console.log('final: saved OK!');
        }
    },
    insert: function (data) {
        this.model.create(data, this.final);
        console.log('insert OK!');
    },
    update: function (conditions, update, options) {
        this.model.update(conditions, update, options, this.final);
        console.log('update OK!');
    },
    remove: function (conditions) {
        this.model.remove(conditions, this.final);
        console.log('remove OK!');
    },
    find: function (conditions) {
        this.model.findByName();
    }
};
exports = module.exports = Model;