const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const moment = require('moment');
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'myblog'
});
//处理post请求
app.use(bodyParser.urlencoded({extended: false}));
//托管静态资源
app.use('/node_modules',express.static('./node_modules'))
//模板引擎
app.engine('html',require('express-art-template'));
app.set('view engine','html');
app.set('views','./views');

app.get('/',(req,res)=> {
    res.render('index.html',{})
});
app.get('/login',(req,res)=> {
    res.render('./user/login.html',{});
});
app.get('/register',(req,res)=>{
    res.render('./user/register.html',{});
});
//注册模板的业务逻辑
app.post('/register',(req,res)=>{
    const user = req.body;
    user.ctime = moment().format('YYYY-MM-DD HH:mm:ss');
    if (user.username.trim().length === 0 ||
        user.password.trim().length === 0 ||
        user.nickname.trim().length === 0) return res.status(400).send({ status: 400, msg: '请填写完整的表单信息!' });

    // 查重: 执行sql语句 在数据库中查询当前提交过来的用户名是否已存在
    const querySql = 'select count(*) as count from users where username = ?'
    connection.query(querySql, user.username, (err, result) => {
        if (err) return res.status(500).send({ status: 500, msg: '用户名查询失败!请重试!' });
        // console.log(result[0].count != 0)
        if (result[0].count !==0) return res.status(402).send({ status: 402, msg: '用户名已存在!请重试!' });
        // 用户名不存在需要执行添加用户的sql语句
        const addSql = 'insert into users set ?';
        connection.query(addSql, user, (err, result) => {
            if (err || result.affectedRows !==1) return res.status(500).send({ status: 500, msg: '用户添加失败!请重试!' });
            res.send({ status: 200, msg: '用户注册成功!' });
        })
    })
});
app.listen(80, function() {
    console.log('Express server running at http://127.0.0.1:80')
});