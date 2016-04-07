/**
 * Created by alex on 15/9/12.
 */
var assert = require('assert');
var should = require('should');
var user = require('../../proxy').User;
var config = require('../../config.test');

describe('proxy/user', function () {
  before('-clear all',function (done) {
    user.delUser({loginname:null}, function (err, result) {
      console.log('clear all user.');
      done();
    })
  });
  context('+find user context', function () {
    it('#getUserList', function (done) {
      var criteria = {};
      user.getUserList(criteria, function (err, result) {
        //console.log(result);
        should.not.exist(err);
        result.should.be.an.instanceOf(Array);
        result[0].should.have.property('loginname');//, 'email', 'phone');
        done();
      });
    });
    var token = ['admin', 'test4@gmail.com', '1800001114'];
    for (var i = 0; i < token.length; i++) {
      //console.log(i + '\n');
      var _token = token[i];
          //console.log(_token + '\n');
          it('#getLoginUser$' + _token, function (done) {
            user.getLoginUser(_token, function (err, result) {
              //console.log(result);
              should.not.exist(err);
              should.exist(result);
              result.should.be.an.instanceOf(Object);
              result.should.have.property('loginname', token[0]);
              result.should.have.property('email', token[1]);
              result.should.have.property('phone', token[2]);
              done();
        });
      });
    }
  });
  context('+create user context', function () {
    var phone = '18600000000',
      pwd = '123456';
    it('#createUser$ok', function (done) {
      user.createUser(phone, pwd, function (err, result) {
        //console.log(err);
        should.not.exist(err);
        should.exist(result);
        result.should.have.property('phone', phone);
        result.should.have.property('password', pwd);
        done();
      });
    });
    it('#createUser$fail', function (done) {
      var ph, pw;
      user.createUser(ph, pw, function (err, result) {
        should.exist(err);
        should.not.exist(result);
        console.log('\n#createUser:\n' + err.toString() + '\n');
        done();
      });
    });
  });
  context('+edit user context', function () {
    var phone = '13800000000',
      pwd = '222222';
    var conditions = {phone: phone},
      update = {loginname: 'hello', email: 'hi@llo.com'};
    before('#create4update',function (done) {
      user.createUser(phone, pwd, function (err, result) {
        console.log(err);
        console.log(result);
        //should.not.exist(err);
        //should.exist(result);
        console.log('create one user to update.');
        done();
      });
    });
    it('#editUser', function (done) {
      user.editUser(conditions, update, function (err, result) {
        should.not.exist(err);
        should.exist(result);
        console.log('\n#editUser:\n' + result + '\n');
        should(result).equal(1);
        done();
      });
    });
  });
  context('+delete user context', function () {
    var phone = '15800000000',
      pwd = '333333';
    it('#create4del',function (done) {
      user.createUser(phone, pwd, function (err, result) {
        should.not.exist(err);
        should.exist(result);
        console.log('create one user to delete.')
        done();
      });
    });
    it('#delUser', function (done) {
      var conditions = {phone: phone};
      user.delUser(conditions, function (err, result) {
        should.not.exist(err);
        should.exist(result);
        console.log('\n#delUser:\n' + result + '\n');
        done();
      });
    });
  });
});
