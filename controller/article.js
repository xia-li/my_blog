const moment = require('moment');
const connection = require('../db/index.js');
const marked = require('marked');
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
            // console.log(result);
            if(err||result.affectedRows!==1) return res.send({status:500,msg:'添加文章失败'});
            res.send({status:200,msg:'ok',authorId:result.insertId});
        })
    },
    handleInfoGet(req,res){
        const id = req.params.id;
        const sql = ' select * from articles where id = ?';
        connection.query(sql,id,(err,result)=>{
            // console.log(result);
            const renderObj ={
                user:req.session.user,
                isLogin:req.session.isLogin,
            };
            result[0].content = marked(result[0].content);
            // console.log(result[0].content);
            renderObj.article = result[0];
            if(err||result.length!==1) return res.render('./404.html',renderObj);
            res.render('./article/info.html',renderObj)
        })
    },
}