const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const moment = require('moment');
//处理post请求
app.use(bodyParser.urlencoded({extended: false}));
//托管静态资源
app.use('/node_modules', express.static('./node_modules'))
//模板引擎
app.engine('html', require('express-art-template'));
app.set('view engine', 'html');
app.set('views', './views');
//引入首页的路由模块
app.use(require('./router/index.js'));
//引入用户功能中心功能路由模块页面
app.use(require('./router/user.js'));
app.listen(80, function () {
    console.log('Express server running at http://127.0.0.1:80')
});