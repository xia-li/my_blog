const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const mditor = require('mditor');
const session = require('express-session');
//只要注册了session的中间件,任何一个使用req对象的地方都可以访问
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}))
//处理post请求
app.use(bodyParser.urlencoded({extended: false}));
//托管静态资源
app.use('/node_modules', express.static('./node_modules'));
//模板引擎
app.engine('html', require('express-art-template'));
app.set('view engine', 'html');
app.set('views', './views');
//路由模块的书写
fs.readdir(path.join(__dirname, './router'), (err, res) => {
        if (err) return console.log('读取文件失败');
        res.forEach(item => {
            const router = require(path.join(__dirname, './router', item));
            app.use(router);
        })
    }
);
app.listen(80, function () {
    console.log('Express server running at http://127.0.0.1:80')
});
