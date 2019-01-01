const express = require('express');
const router = express.Router();
const {wrap} = require('@awaitjs/express');
const {User} = require('../../../models/user');
const lodash = require('lodash');

// 更新用户信息
router.post('/information', wrap(async function (req, res, next) {
    try {
        const body = req.body || {};
        if (!lodash.get(body, 'nickName')) {
            res.sendError('姓名不能为空');
        } else {
            const user = await User.findOne({openId: req.header('Authorization')});
            if (!user) {
                res.sendError('未找到该用户');
            } else {
                res.sendSuccess(await User.findOneAndUpdate({openId: req.header('Authorization')}, {$set: Object.assign(req.body, {updatedAt: +new Date()})}, {new: true}));
            }
        }
    } catch (e) {
        next(e);
    }
}));

// 意见反馈
router.post('/suggestion/add', wrap(async function (req, res, next) {
    try {
        const user = await User.findOne({openId: req.header('Authorization')});
        if (!user) {
            res.sendError('未找到该用户');
        } else {
            let suggestionList = user.suggestionList || [];
            suggestionList.push({
                text: req.body.text,
                createdAt: +new Date()
            });
            res.sendSuccess(await User.findOneAndUpdate({openId: req.header('Authorization')}, {
                $set: Object.assign(user, {suggestionList: suggestionList})
            }, {new: true}));
        }
    } catch (e) {
        next(e);
    }
}));

module.exports = router;