const express = require('express');

const router = express.Router();

const ctl = require('../controller/index.js');

router.get('/',ctl.handleIndex );

module.exports = router;