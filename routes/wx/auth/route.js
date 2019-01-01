const express = require('express');
const router = express.Router();
const axios = require('axios');
const {wrap} = require('@awaitjs/express');
const env = process.env.NODE_ENV || 'development';
const config = require('../../../config/config.json');
const {User} = require('../../../models/user');

// 获取openid
router.post('/getOpenId', wrap(async function (req, res) {
    let loginInfo = await axios.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${config[env].APPID}&secret=${config[env].SECRET}&js_code=${req.body.wxCode}&grant_type=authorization_code`);
    if (loginInfo.data && loginInfo.data.openid) {
        res.sendSuccess({openId: loginInfo.data.openid});
    } else {
        res.sendError('获取用户验证失败', 401);
    }
}));

// 登录
router.post('/login', wrap(async function (req, res, next) {
    try {
        let body = Object.assign(req.body, {openId: req.header('Authorization')});
        res.sendSuccess(await User.findOneAndUpdate({openId: req.body.openId}, {$set: body}, {upsert: true}));
    } catch (e) {
        next(e);
    }
}));

module.exports = router;