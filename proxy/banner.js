var bannerModel, bannerProxy, baseProxy, models;

baseProxy = require('./base_proxy');
models = require('../models');
bannerModel = models.Banner;

bannerProxy = new baseProxy(bannerModel);

exports.getList = function (criteria, callback) {
    return bannerProxy.getList(criteria, callback);
};
