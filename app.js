

var express = require("express");

var app = express();
var router = require("./controller");

app.set("view engine","ejs");

//注意中间件顺序

//路由中间件
//静态页面
app.use(express.static("./public"));
app.use(express.static("./uploads"));
//首页
app.get("/",router.showIndex);

app.get("/:albumName",router.showAlbum);

app.get("/up",router.showUp);

app.post("/up",router.dopost);

//404
app.use(function (req,res) {
    res.render("err");
});

app.listen(3000);
