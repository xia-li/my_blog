module.exports = {
    handleIndex(req, res) {
        // console.log(req.session.user);
        res.render('index.html', {
            user:req.session.user,
            isLogin:req.session.isLogin
        })
    }
};