const moment = require('moment');
const connection = require('../db/index.js');
module.exports = {
    handleAddGet(req,res){
        if (!req.session.isLogin) return res.redirect('/');
        res.render('./article/add.html', {
            user:req.session.user,
            isLogin:req.session.isLogin
        });
        // console.log(req.session.user);
    },
    handleAddPost(req,res){
        const article = req.body;
        article.ctime = moment().format('YYYY-MM-DD HH-mm-ss');
        // console.log(article);
        const sql = 'insert into articles set ?';
        connection.query(sql,article,(err,result)=>{
            if(err) return res.send({status:500,msg:'添加文章失败'});
            res.send({status:200,msg:'ok'});
        })
    }
}