const app = require('express');
const router = app.Router();

let accessToken=require('../config/syncAccessToken');

router.all('/**', function (req, res, next) {
    req.wxToken = process.env.accessToken ;
    next();
});

module.exports = router;