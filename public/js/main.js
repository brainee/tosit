/**
 * Created by koyoshiro on 15/8/18.
 */

var libPath=''

require.config({
    baseUrl: '',
    shim: {
        bs: {
            deps: ["jQuery"],
            exports: "bs"
        },
        imageCorp: {
            exports: "imageCorp"
        },
        Jcrop: {
            deps: ["jQuery"],
            exports: "Jcrop"
        },
        fullPage: {
            deps: ["jQuery"],
            exports: "fullPage"
        }
    },
    paths: {

        'bs': libsPath + 'bootstrap.min',
        'jQuery': libsPath + 'jquery-1.11.3.min',
        'imageCorp': libsPath + 'imageCorp',
        'uploadImg': corePath + 'uploadImg',
        'Jcrop': libsPath + 'jquery.Jcrop',
        'fullPage': libsPath + 'jquery.fullPage.min'
        //,
        //'tmp_section':'Core/tmp_section.html'


    }
});
require(['jQuery', 'Jcrop', 'fullPage'],
    function (jQuery, Jcrop, fullPage) {

    });