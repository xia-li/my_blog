const express = require('express');

const router = express.Router();

const crl = require('../controller/user.js');

router.get('/login',crl.handleLoginGet);
router.get('/register', crl.handleRegisterGet);
//注册模板的业务逻辑
router.post('/register',crl.handleRegisterPost );
//登陆页面的业务逻辑
router.post('/login', crl.handleLoginPost);
//注销登录的逻辑
router.get('/logout',crl.handleLogoutGet)
module.exports = router;