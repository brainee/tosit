/**
 * Created by alex on 15/7/28.
 */
var model = require('../../model.js');
var testSchema = {test: {type: String, default: 'test'}};
var target = new model(testSchema, 'testModel');

exports.testModel = {
    setUp: function (callback) {
        callback();
    },
    tearDown: function (callback) {
        callback();
    },
    testInsert: function (test) {
        var d = {test: 'aaa'};
        target.insert(d);
        test.ok(true, 'insert success.');
        test.done();
    },
    testUpdate: function(test){
        var conditions = {test: 'aaa'},
            update = {$set:{test: 'bbb', num: 123, date: new Date()}},
            ops = {upsert : true};
        target.update(conditions,update,ops);
        test.ok(true, 'update success.');
        test.done();
    },
    testRemove: function(test){
        var conditions = {test: 'bbb'};
        target.remove(conditions);
        test.ok(true, 'remove success.');
        test.done();
    }
};
