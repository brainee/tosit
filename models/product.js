/**
 * Created by alex on 15/9/3.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ProductMaterialSchema = require('./material').Schema;

var ProductImageSchema = new Schema({
    type: String,
    url: String,
    thumbUrl: String, //缩略图
    alt: String,
    sort: Number,
    create_at: {type: Date, default: Date.now},
    update_at: {type: Date, default: Date.now}
});

var ProductCategorySchema = new Schema({
    key: String,
    name: String,
    sort: Number,
    subs: [ProductCategorySchema]
});
ProductCategorySchema.index({key: 1},{unique: true});

var ProductStyleSchema = new Schema({
    key: String,
    name: String,
    sort: Number,
    subs: [ProductStyleSchema]
});
ProductStyleSchema.index({key: 1},{unique: true});

var ProductSchema = new Schema({
    code: String, // 产品编号
    name: String,
    subTitle: String,
    originPrice: Number, //原价
    refPrice: Number, //参考价格
    activityInfo: String,
    info: String, // 商品详情
    spec: String, // 规格参数
    postSale: String, // 售后服务
    active: {type: Boolean, default: true},
    create_at: {type: Date, default: Date.now},
    update_at: {type: Date, default: Date.now},
    //banners: [ActivityBannerSchema], // 活动的banner，内嵌在产品详情页的
    year: String, // 年份
    categories: String,//[ProductCategorySchema],
    styles: String,//[ProductStyleSchema],
    materials: [ProductMaterialSchema], // 产品面料属性
    images: [ProductImageSchema]
});
ProductSchema.index({code: 1}, {unique: true});
//ProductSchema.plugin(BaseModel);

mongoose.model('ProductCategory', ProductCategorySchema);
mongoose.model('ProductStyle', ProductStyleSchema);
mongoose.model('ProductImage', ProductImageSchema);
mongoose.model('Product', ProductSchema);

exports.ProductSchema = ProductSchema;
