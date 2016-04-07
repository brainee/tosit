var Schema, bannerSchema, mongoose;

mongoose = require('mongoose');

Schema = mongoose.Schema;

bannerSchema = new Schema({
    picUrl: String,
    thumbUrl: String,
    alt: String,
    targetUrl: String,
    create_at: {
        type: Date,
        "default": Date.now
    },
    update_at: {
        type: Date,
        "default": Date.now
    }
});

mongoose.model('Banner', bannerSchema);