/**
 * Created by alex on 15/9/28.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ProductMaterialSchema = new Schema({
    category: String, // key
    class: String, // 款式、面辅料、特殊工艺
    label: String, // 领型、口袋型等...
    type: String, // 图片、文字
    items: [{
        name: String,
        icon: String // 图片类型的就存url地址（图片位置 /upload/product/mate-icon
    }],
    create_at: {type: Date, default: Date.now},
    update_at: {type: Date, default: Date.now}
});

mongoose.model('ProductMaterial', ProductMaterialSchema);

exports.Schema = ProductMaterialSchema;
