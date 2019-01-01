const express = require('express');
const router = express.Router();
const fs = require('fs');
// 初始化Client
const OSS = require('ali-oss');
const config = require('../../../config/config.json');
let env = process.env.NODE_ENV || 'development';

const client = new OSS({
    bucket: config[env].ALIYUN.BUCKET,
    region: config[env].ALIYUN.REGION,
    accessKeyId: config[env].ALIYUN.ACCESSKEYID,
    accessKeySecret: config[env].ALIYUN.ACCESSKEYSECRET
});

// 微信小程序 图片上传
const multer = require('multer');
const upload = multer({dest: './tmp/'});
// 图片上传
router.all('/uploadFile', upload.single('file'), function (req, res, next) {

    // 文件路径
    const filePath = './' + req.file.path;
    // 文件类型
    const temp = req.file.originalname.split('.');
    const fileType = temp[temp.length - 1];
    const lastName = '.' + fileType;
    // 构建图片名
    const fileName = Date.now() + lastName;
    // 图片重命名
    fs.rename(filePath, './tmp/' + fileName, (err) => {
        if (err) {
            res.end(JSON.stringify({status: '102', msg: '文件写入失败'}));
        } else {
            const localFile = './tmp/' + fileName;
            const key = 'tmp/' + fileName;

            async function put() {
                try {
                    let result = await client.put(key, localFile);
                    try {
                        fs.unlinkSync(localFile);
                    } catch (e) {
                    }
                    res.sendSuccess(result.url);
                } catch (e) {
                    res.sendError(e)
                }
            }

            put();
        }
    });
});
module.exports = router;