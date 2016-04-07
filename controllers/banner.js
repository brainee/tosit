var bannerProxy, proxy;
proxy = require('../proxy');
bannerProxy = proxy.Banner;

exports.manage = function (req, res) {
    return bannerProxy.getList({}, function (err, data) {
        return res.render('offline/banners', {
            data: data
        });
    });
};