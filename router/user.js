const express = require('express');

const router = express.Router();

const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'myblog'
});
router.get('/login', (req, res) => {
    res.render('./user/login.html', {});
});
router.get('/register', (req, res) => {
    res.render('./user/register.html', {});
});
//注册模板的业务逻辑
router.post('/register', (req, res) => {
    const user = req.body;
    user.ctime = moment().format('YYYY-MM-DD HH:mm:ss');
    if (user.username.trim().length === 0 ||
        user.password.trim().length === 0 ||
        user.nickname.trim().length === 0) return res.status(400).send({status: 400, msg: '请填写完整的表单信息!'});

    // 查重: 执行sql语句 在数据库中查询当前提交过来的用户名是否已存在
    const Sql = 'select count(*) as count from users where username = ?'
    connection.query(Sql, user.username, (err, result) => {
        if (err) return res.status(500).send({status: 500, msg: '用户名查询失败!请重试!'});
        // console.log(result[0].count != 0)
        if (result[0].count !== 0) return res.status(402).send({status: 402, msg: '用户名已存在!请重试!'});
        // 用户名不存在需要执行添加用户的sql语句
        const Sql1 = 'insert into users set ?';
        connection.query(Sql1, user, (err, result) => {
            if (err || result.affectedRows !== 1) return res.status(500).send({status: 500, msg: '用户添加失败!请重试!'});
            res.send({status: 200, msg: '用户注册成功!'});
        })
    })
});
//登陆页面的业务逻辑
router.post('/login', (req, res) => {
    const user = req.body;
    const sql = 'select * from users where username = ? and password = ?';
    connection.query(sql, [user.username, user.password], (err, result) => {
        if (err) return res.status(500).send({status: 500, msg: '登录失败!请重试!'});
        if (result.length === 0) return res.status(400).send({status: 400, msg: '用户名或密码错误!请重试!'});
        res.send({status: 200, msg: '恭喜您!登录成功!'})
    })
});
module.exports = router;