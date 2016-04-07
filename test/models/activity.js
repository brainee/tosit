/**
 * Created by alex on 15/9/13.
 */
var model = require('../../models');
var suite = require('../../lib/testSuite');
var mock = {
  data: {
    serial: 1,
    imageUrl: '/upload/a01.png',
    alt: 'test activiy banner suite',
    targetUrl: 'http://www.baidu.com'
  },
  search: {serial: 1},
  update: {$set: {alt: 'test activiy banner updated'}},
  select: ''
};
var desc = 'models/activity';
var activitySuite = new suite(model.Ads, desc, mock);
activitySuite.run();
