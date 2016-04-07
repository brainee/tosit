/**
 * Created by alex on 15/9/7.
 */
var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;

/**
 * 活动相关（首页、产品详情页轮播图片）
 * @type {*|Schema}
 */
var AdsSchema = new Schema({
  imageUrl: String,
  alt: String,
  targetUrl: String
});
mongoose.model('Ads', AdsSchema);