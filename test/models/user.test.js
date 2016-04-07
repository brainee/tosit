var request = require('supertest');
var userModel = require('../../models').User;
var config = require('../../config.test');
var keeper = require('../../lib/mKeeper');
//keeper.config(config.db);

var user = {
    loginname: 'test4',
    email: 'test4@gmail.com',
    phone: '1800001114',
    accessToken: 'slsls'
};

describe('models/user', function () {
    before('-clear', function (done) {
        keeper.use(removeAll, function (err) {
            if (err) {
                console.log('clear err:' + err);
            } else {
                console.log('clear ok!');
                done();
            }
        })
    });
    context('user tests', function () {

        it('#create35', function (done) {
            for (var i = 0; i < 35; i++) {
                var data = {
                    loginname: 'test' + i,
                    email: 'test' + i + '@qq.com',
                    phone: 18621060000 + i
                };
                keeper.use(function (proxy) {
                    userModel.create(data, proxy);
                }, function (err, result) {
                    console.log('create - ' + result + '\n');
                });
            }
            done();
        });

        it('#create', function (done) {
            keeper.use(createUser, function (err, result) {
                if (err) {
                    console.log('#create err :' + err);
                    throw err;
                }
                else {
                    console.log('#create:' + result);
                    done();
                }
            });
        });
        it('#update', function (done) {
            keeper.use(updateUser, function (err, result) {
                if (err) {
                    console.log('#update err:' + err);
                    throw err;
                } else {
                    console.log('#update:' + result);
                    done();
                }
            });
        });
        it('#findOne', function (done) {
            keeper.use(findOne, function (err, result) {
                if (err) {
                    console.log('#findOne err:' + err);
                    throw err;
                } else {
                    console.log('#findOne:' + result);
                    done();
                }
            });
        });
        it('#findOne2', function (done) {
            keeper.use(findOne2, function (err, result) {
                if (err)console.log('#findOne2:' + err);
                console.log('#findOne2:' + result);
                done();
            })
        });

    });
});

//proxy 参数即为mongoosekeeper.use的第二个参数
function createUser(proxy) {
    userModel.create(user, proxy);
}
function updateUser(proxy) {
    var search = {loginname: 'test4'},
        update = {$set: {loginname: 'admin'}},
        opts = {upsert: true};
    userModel.update(search, update, opts, function (err) {
        if (err) {
            console.log('update error:' + err);
        }
        else {
            console.log('update ok!');
            proxy();
        }
    });
}
function findOne(proxy) {
    var conditions = {loginname: 'admin'};
    var query = userModel.findOne(conditions);
    query.select('loginname phone create_at update_at');
    query.exec(function (err, user) {
        if (err) console.log(err);
        console.log('#findOne:' + user);
        proxy();
    })
}
function findOne2(proxy) {
    userModel.
        find({loginname: 'admin'}).
        where('email').equals('test4@gmail.com').
        limit(10).
        sort('-create_at').
        select('loginname').
        exec(function (err, user) {
            console.log('#findOne2:' + user);
            proxy();
        });
}
function removeAll(proxy) {
    var conditions = {};
    userModel.remove(conditions, function (err) {
        if (err) console.log(err);
        console.log('user remove ok!');
        proxy();
    })
}
