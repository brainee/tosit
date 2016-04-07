/**
 * Created by alex on 15/9/19.
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var contentSchema = new Schema({
    key: String,
    title: String,
    subtitle: String,
    content: String,
    create_at: {type: Date, default: Date.now},
    update_at: {type: Date, default: Date.now},
    active: {type: Boolean, default: true}
});
contentSchema.index({key: 1}, {unique: true});
mongoose.model('Content', contentSchema);
