/**
 * Created by alex on 15/9/7.
 */
var request = require('supertest');
var should = require('should');
var keeper = require('../../lib/mKeeper');
var suite = require('../../lib/testSuite');

var model = require('../../models');
var mock = {
  data: {
    name: 'test prodcut suite',
    subTitle: 'Sub Titile',

  },
  search: {name: 'test prodcut suite'},
  update: {$set: {subTitle: 'test prodcut updated'}},
  select: ''//'name subTitle create_at'
};
var desc = 'models/product';
var productSuite = new suite(model.Product, desc, mock);
productSuite.run();

desc = 'models/productCategory';
mock = {
  data:{
    name:'category',
    subs: [{name:'sub1'},{name: 'sub2'}]
  },
  search: {name: 'category'}
}
productCateSuite = new suite(model.ProductCategory,desc, mock);
productCateSuite.run();


desc = 'models/productStyle';
mock = {
  data:{
    name:'style',
    subs: [{name:'sub1'},{name: 'sub2'}]
  },
  search: {name: 'style'}
}
productStyleSuite = new suite(model.ProductStyle,desc, mock);
productStyleSuite.run();

desc = 'models/productAttribute';
mock = {
    data:{
        name:'style',
        subs: [{name:'sub1'},{name: 'sub2'}]
    },
    search: {name: 'style'}
}
productStyleSuite = new suite(model.ProductStyle,desc, mock);
productStyleSuite.run();
