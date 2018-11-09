const connection = require('../db/index')
module.exports = {
    handleIndex(req, res) {
        // console.log(req.session.user);
        let pageSize = 3;
        let currentPage = parseInt(req.query.page) || 1
        /** @namespace req.query.page */
        const sql = `select a.id, a.title, a.ctime, u.nickname, u.username from articles as a
    left join users as u
    on a.author_id = u.id
    order by a.id desc
    limit ${(currentPage - 1) * pageSize}, ${pageSize};
    select count(*) as count from articles;`
        connection.query(sql, (err, result) => {
            const totalPage = Math.ceil(parseInt(result[1][0].count) / pageSize);
            res.render('index.html', {
                user: req.session.user,
                isLogin: req.session.isLogin,
                article: result[0],
                totalPage: totalPage,
                currentPage: currentPage
            })
        })

    }
};