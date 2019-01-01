const express = require('express');
const router = express.Router();

// openId 验证
router.all('/**', function (req, res, next) {
    if (req.url !== '/auth/getOpenId' && !req.header('Authorization')) {
        res.sendError('no authenticate', 401);
    }
    next();
});

router.use('/auth', require('./auth/route'));
router.use('/user', require('./user/route'));
router.use('/record', require('./record/route'));

module.exports = router;