
var file = require("../models/file.js");
var formidable = require("formidable");
var path = require("path");
var fs = require("fs");
var sd = require("silly-datetime");

exports.showIndex = function (req,res,next) {
    //nodejs异步，造成出错
    // res.render("index",{
    //     "albums" : file.getAllAlbums()
    // });

    //这就是node。js的编程思维，所有东西都是异步的
    //所以，内层函数，不是return回来东西，而是调用高层函数提供的
    //回调函数，把数据当作回调函数的参数来使用
    file.getAllAlbums(function (err,allAlbums) {
        if (err){
            next(); //交给下面适合他的中间件
            return;
        }
        res.render("index",{
            "albums" : allAlbums
        });
    })
};
//相册页
exports.showAlbum = function (req,res,next) {
    //遍历相册中的所有图片
    var albumName = req.params.albumName;
    //具体业务交给model
    // 错误示范
    // res.render("album",{
    //     "albumname" : albumName,
    //     "images" : ["1.jpg","2.jpg","3.jpg"]
    // });
    file.getAllImagesByAlbumName(albumName,function (err, imagesArray) {
        if (err){
            next();
            return;
        }
        res.render("album",{
            "albumname" : albumName,
            "images" : imagesArray
        });
    });

};
//显示上传
exports.showUp = function (req,res,next) {
    //命令file模块（我们自己写的函数）调用getAllAlbums函数
    //得到所有文件夹名字之后做的事情，写在回调函数里面
    file.getAllAlbums(function (err,albums) {
        res.render("up",{
            albums : albums
        });
    });
};
//上传表单
exports.dopost = function (req,res) {

    var form = new formidable.IncomingForm();

    form.uploadDir = path.normalize(__dirname + "/../tempup/");
    console.log(__dirname + "/../tempup/");
    form.parse(req, function(err, fields, files,next) {
        console.log(fields);
        console.log(files);
        //改名
        if(err){
            next(); //这个中间件不受理这个请求了，往下走
            return;
        }
        //判断文件尺寸
        var size = parseInt(files.tupian.size);
        if (size > 4000) {
            res.send("图片尺寸应该小于3M");
            //删除图片
            fs.unlink(files.tupian.path);
            return;
        }
        //时间
        var ttt = sd.format(new Date(), 'YYYYMMDDHHmmss');
        var ran = parseInt(Math.random() * 89999 + 10000);
        var extname = path.extname(files.tupian.name);

        var wenjianjia = fields.wenjianjia;
        var oldpath = files.tupian.path;
        var newpath = path.normalize(__dirname +
            "/../uploads/"+ wenjianjia + "/" + ttt + ran + extname);
        fs.rename(oldpath,newpath,function (err) {
            if (err){
               res.send("改名失败");
               return;
            }
            res.send("成功");
        });

    });

return;
};