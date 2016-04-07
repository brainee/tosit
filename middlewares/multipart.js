/**
 * Created by koyoshiro on 15/9/12.
 */

//页面JADE
//form(method='post', action='/file/uploading', enctype='multipart/form-data')
//input(name='inputFile', type='file', multiple='mutiple')
//input(name='btnUp', type='submit',value='上传')

var multiparty = require('multiparty');
var http = require('http');
var util = require('util');
var fs = require("fs");

//上传
http.createServer(function (req, res) {
    if (req.url === '/upload' && req.method === 'POST') {
        // 解析一个文件上传
        var form = new multiparty.Form();
        //设置编辑
        form.encoding = 'utf-8';
        //设置文件存储路径
        form.uploadDir = "uploads/images/";
        //设置单文件大小限制
        form.maxFilesSize = 2 * 1024 * 1024;
        //form.maxFields = 1000;  设置所以文件的大小总和
        form.parse(req, function (err, fields, files) {
            console.log(files.originalFilename);
            console.log(files.path);
            //同步重命名文件名
            fs.renameSync(files.path, files.originalFilename);
            res.writeHead(200, {'content-type': 'text/plain'});
            res.write('received upload:\n\n');
            res.end(util.inspect({fields: fields, files: files}));
        });

        return;
    }

    // show a file upload form
    res.writeHead(200, {'content-type': 'text/html'});
    res.end(
        '<form action="/upload" enctype="multipart/form-data" method="post">' +
        '<input type="text" name="title"><br>' +
        '<input type="file" name="upload" multiple="multiple"><br>' +
        '<input type="submit" value="Upload">' +
        '</form>'
    );
});

/* 下载*/
//router.post('/file/uploading', function (req, res, next) {
exports.download = function (req, res, next) {
    //生成multiparty对象，并配置下载目标路径
    var form = new multiparty.Form({uploadDir: './public/files/'});
    //下载后处理
    form.parse(req, function (err, fields, files) {
        var filesTmp = JSON.stringify(files, null, 2);

        if (err) {
            console.log('parse error: ' + err);
        } else {
            console.log('parse files: ' + filesTmp);
            var inputFile = files.inputFile[0];
            var uploadedPath = inputFile.path;
            var dstPath = './public/files/' + inputFile.originalFilename;
            //重命名为真实文件名
            fs.rename(uploadedPath, dstPath, function (err) {
                if (err) {
                    console.log('rename error: ' + err);
                } else {
                    console.log('rename ok');
                }
            });
        }

        res.writeHead(200, {'content-type': 'text/plain;charset=utf-8'});
        res.write('received upload:\n\n');
        res.end(util.inspect({fields: fields, files: filesTmp}));
    });
};