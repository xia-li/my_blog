const express = require('express');
const app = express();
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
app.listen(80, function() {
    console.log('Express server running at http://127.0.0.1:80')
});