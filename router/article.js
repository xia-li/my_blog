const express = require('express');
const router = express.Router();
const ctrl = require('../controller/article.js');
//处理文章添加页
router.get('/article/add',ctrl.handleAddGet);
router.post('/article/add',ctrl.handleAddPost);
router.get('/article/info/:id',ctrl.handleInfoGet);

module.exports = router;
