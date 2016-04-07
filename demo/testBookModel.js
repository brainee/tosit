/**
 * Created by alex on 15/7/29.
 */
var target = require('../models/land10001.js');

/*for test*/
var book = {
    basic_info: {
        name: 'alex',
        gender: 'male',
        height: 170,
        weight: 65
    }, contact_info: {
        remark: 'nothing'
    }
};
exports.testBookModel={
    testInsert: function (test) {
        target.insert(book);
        test.ok(true, 'insert success.');
        test.done();
    },
    testUpdate: function(test){
        var conditions = {basic_info: {name:'alex'}},
            update = {$set:{basic_info: {name:'bob'}}},
            ops = {upsert : true};
        target.update(conditions,update,ops);
        test.ok(true, 'update success.');
        test.done();
    },
    testRemove: function(test){
        var conditions = {basic_info: {name:'bob'}};
        target.remove(conditions);
        test.ok(true, 'remove success.');
        test.done();
    }
};
