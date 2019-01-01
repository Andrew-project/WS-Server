const express = require('express');
const router = express.Router();
const {wrap} = require('@awaitjs/express');
const lodash = require('lodash');
const {Record} = require('../../../models/record');

// 发布动态
router.post('/add', wrap(async function (req, res, next) {
    try {
        const body = req.body || {};
        if (!lodash.get(body, 'text') && !((lodash.get(body, 'picture') || []).length)) {
            res.sendError('请填写发布内容');
        } else {
            let record = new Record({
                openId: req.header('Authorization'),
                content: {
                    text: body.text || '',
                    pictures: body.pictures || []
                },
                address: body.address || {}
            });
            res.sendSuccess(await (await record.save()).insertUserInfo());
        }
    } catch (e) {
        next(e)
    }
}));

router.get('/list', wrap(async function (req, res, next) {
    try {
        let records = await Record.find() || [];
        for (let r of records) {
            await r.insertUserInfo();
        }
        res.sendSuccess(records.sort(function (a, b) {
            return b.updatedAt - a.updatedAt;
        }))
    } catch (e) {
       next(e);
    }
}));

router.get('/list/me', wrap(async function (req, res, next) {
    try {
        let records = await Record.find({openId: req.header('Authorization')}) || [];
        for (let r of records) {
            await r.insertUserInfo();
        }
        res.sendSuccess(records.sort(function (a, b) {
            return a.updatedAt - b.updatedAt;
        }))
    } catch (e) {
        next(e);
    }
}));

router.post('/verb', wrap(async function (req, res, next) {
    try {
        let record = await Record.findOne({id: req.body.id});
        if (record) {
            record.updatedAt = +new Date();
            record.verbs = [...record.verbs, {fromId: req.header('Authorization'), isVerb: req.body.isVerb, updatedAt: +new Date()}];
            res.sendSuccess(await (await Record.findOneAndUpdate({id: req.body.id}, {
                $set: record
            }, {
                new: true
            })).insertUserInfo())
        } else {
            res.sendError('没有找到数据')
        }
        console.log(record)
    } catch (e) {
        next(e);
    }
}));

module.exports = router;