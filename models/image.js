/**
 * Created by alex on 15/9/3.
 */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var imageSchema = new Schema({
    type: String,
    url: String,
    thumbUrl: String, //缩略图
    alt: String,
    sort: Number,
    create_at: {type: Date, default: Date.now},
    update_at: {type: Date, default: Date.now}
});
mongoose.model('Image', imageSchema);
