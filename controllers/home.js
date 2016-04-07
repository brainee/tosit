/* GET home page. */
// 前台
exports.index = function (req, res) {
    res.render('index', {
        title: 'MELDOR高级服装定制'
    });
};
