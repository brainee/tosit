/**
 * Created by alex on 15/7/27.
 */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var BaseModel = require("./base_model");

var UserSchema = new Schema({
  nickname: {type: String},
  loginname: {type: String},
  password: {type: String},
  phone: {type: String},
  email: {type: String},
  url: {type: String},
  location: {type: String}, //所在地区
  profile: {type: String},
  weibo: {type: String},
  weixin: {type: String},
  qq: {type: String},
  is_admin: {type: Boolean, default: false},
  create_at: {type: Date, default: Date.now},
  update_at: {type: Date, default: Date.now},
  active: {type: Boolean, default: true},
  accessToken: {type: String}
});

//UserSchema.index({loginname: 1}, {unique: true});
//UserSchema.index({email: 1}, {unique: true});
UserSchema.index({phone: 1}, {unique: true});
UserSchema.index({accessToken: 1});

//UserSchema.plugin(BaseModel);
mongoose.model('User', UserSchema);
