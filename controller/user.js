const moment = require('moment');
const connection = require('../db/index.js');
const bcyrpt = require('bcrypt');
module.exports = {
    handleLoginGet(req, res) {
        res.render('./user/login.html', {});
    },
    handleRegisterGet(req, res) {
        res.render('./user/register.html', {});
    },
    handleRegisterPost(req, res){
    const user = req.body;
    user.ctime = moment().format('YYYY-MM-DD HH:mm:ss');
    if (user.username.trim().length === 0 ||
        user.password.trim().length === 0 ||
        user.nickname.trim().length === 0) return res.status(400).send({status: 400, msg: '请填写完整的表单信息!'});

    // 查重: 执行sql语句 在数据库中查询当前提交过来的用户名是否已存在
    const Sql = 'select count(*) as count from users where username = ?';
    connection.query(Sql, user.username, (err, result) => {
        if (err) return res.status(500).send({status: 500, msg: '用户名查询失败!请重试!'});
        // console.log(result[0].count != 0)
        if (result[0].count !== 0) return res.status(402).send({status: 402, msg: '用户名已存在!请重试!'});
        //进行明文加密
        const saltRounds = 10;
        bcyrpt.hash(user.password,saltRounds,(err,hash)=>{
            user.password = hash;
            // 用户名不存在需要执行添加用户的sql语句
            const Sql1 = 'insert into users set ?';
            connection.query(Sql1, user, (err, result) => {
                if (err || result.affectedRows !== 1) return res.status(500).send({status: 500, msg: '用户添加失败!请重试!'});
                res.send({status: 200, msg: '用户注册成功!'});
            })
        })

    })
},
    handleLoginPost(req, res) {
    const user = req.body;
    const sql = 'select * from users where username = ?';
    connection.query(sql, user.username, (err, result) => {
        if (err) return res.status(500).send({status: 500, msg: '登录失败!请重试!'});
        if (result.length === 0) return res.status(400).send({status: 400, msg: '用户名或密码错误!请重试!'});
        /** @namespace err.compareResult */
        bcyrpt.compare(user.password,result[0].password,(err,compareResult)=>{
            if (err || !compareResult) return res.status(400).send({ status: 400, msg: '用户名或密码错误!请重试!' });
            //储存登陆信息并且设置储存时间
            let hour = 1000*60*60*24*30;
            req.session.cookie.expires = new Date(Date.now() + hour);
            req.session.user = result[0];
            req.session.isLogin = true;
            res.send({status: 200, msg: '恭喜您!登录成功!'})
        })

    })
},
    handleLogoutGet(req,res) {
        req.session.destroy(err=>{
            res.redirect('/');
        })
    }
};