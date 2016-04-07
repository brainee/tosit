var request = require('supertest');
var should = require('should');
var app = require('../app');

process.env.NODE_ENV = 'development';
console.log(process.env.NODE_ENV);

var config = require('../config.test');
var keeper = require('../lib/mKeeper');
keeper.config(config.db);

describe('test/app.test.js', function () {
  it('should / status 200', function (done) {
    request(app)
      .get('/')
      .end(function (err, res) {
        res.status.should.equal(200);
        res.text.should.containEql('首页');
        done();
      });
  });
});
