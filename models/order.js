/**
 * Created by alex on 15/9/11.
 */

'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ProductSchema = require('./product').ProductSchema;

var OrderSchema = new Schema({
    orderId: {type: String, index: {unique: true}},
    uid: String,
    userInfo: Object,
    userAchieve: String,
    name: String,
    desc: String,
    price: Number,
    state: String,
    remark: String, // 备注
    cart: Object,
    create_at: {type: Date, default: Date.now},
    update_at: {type: Date, default: Date.now}
});
mongoose.model('Order', OrderSchema);
