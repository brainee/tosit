/**
 * Created by alex on 15/9/7.
 */
var request = require('supertest');
var keeper = require('./mKeeper');
/**
 * 基本测试工具类
 * @param model 目标Model
 * @param desc 测试describe标题
 * @param mock 模拟测试数据
 *
 * eg:
 * var mock = {
 *  data: {name: 'test prodcut suite'}, // mock数据对象
 *  search: {name: 'test prodcut suite'}, // 查询、更新、删除的搜索条件
 *  update: {$set: {subTitle: 'test prodcut updated'}} // 需要更新的值
 *  select: 'name subTitle' // 指定查询的字段，不需要留空
 * };
 *
 * @constructor
 */
function UnitTest(model, desc, mock) {
  this.model = model;
  this.desc = desc;
  this.mock = mock;
}
//var mock = {name: 'test prodcut'};

UnitTest.prototype.run = function () {
  var model = this.model;
  var mock = this.mock;
  var desc = this.desc;
  //proxy 参数即为mongoosekeeper.use的第二个参数
  function create(proxy) {
    model.create(mock.data, function (err) {
      if (err) {
        throw err;
      }
      else {
        proxy();
        //console.log('model.create:'+result);
      }
    });
  }

  function update(proxy) {
    var search = mock.search, //{name: 'test prodcut'},
      update = mock.update, //{$set: {subTitle: 'test prodcut2'}},
      opts = {upsert: true};
    model.update(search, update, opts, function (err) {
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
    var search = mock.search; //{name: 'test prodcut'};
    var query = model.findOne(search);
    //query.select('name subTitle create_at update_at');
    query.select(mock.select);
    query.exec(function (err, result) {
      if (err) console.log(err);
      console.log('findOne:' + result);
      proxy();
    })
  }

  function removeOne(proxy) {
    var conditions = mock.search;
    model.remove(conditions, function (err) {
      if (err) console.log(err);
      console.log('remove ok!');
      proxy();
    });
  }

  function removeAll(proxy) {
    var conditions = {};
    model.remove(conditions, function (err) {
      if (err) console.log(err);
      console.log('remove ok!');
      proxy();
    })
  }

  describe(desc, function () {
    before('-clear', function (done) {
      keeper.use(removeAll, function (err) {
        if (err) {
          console.log('-clear err:' + err);
        } else {
          console.log('-clear ok!\n');
          done();
        }
      })
    });
    after('-removeOne', function (done) {
      keeper.use(removeOne, function (err) {
        if (err) {
          console.log('-removeOne err:' + err);
        } else {
          console.log('-removeOne ok!\n');
          done();
        }
      })
    });
    describe(desc +'/cud', function () {
      it('#create', function (done) {
        keeper.use(create, function (err, result) {
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
        keeper.use(update, function (err, result) {
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
    });

  });
}

exports = module.exports = UnitTest;
