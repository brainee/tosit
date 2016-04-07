/**
 * Created by feng on 2015/10/24.
 */

//var mongoose = require('mongoose'),
//    Schema = mongoose.Schema,
//    ProductSchema = require('./product').ProductSchema,
//    ProductMaterialSchema = require('./material').Schema;
//
//var CartSchema = new Schema({
//    uid: String,//用户id
//    num: Number,//件数
//    remark: String, // 备注
//    items: [{
//        product:ProductSchema,
//        materials:[ProductMaterialSchema]
//    }],
//    create_at: {type: Date, default: Date.now},
//    update_at: {type: Date, default: Date.now}
//});
//
//mongoose.model('Cart', CartSchema);

'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ProductSchema = require('./product').ProductSchema,
    ProductMaterialSchema = require('./material').Schema;

var CartSchema = new Schema({
    uid: String,//用户id
    userAchieve: String,//对应的用户档案
    items: {
        product: Object,
        materials: Object //[ProductMaterialSchema]
    },
    remark: String, // 备注
    create_at: {type: Date, default: Date.now},
    update_at: {type: Date, default: Date.now}
});

mongoose.model('Cart', CartSchema);