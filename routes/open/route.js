const express = require('express');
const router = express.Router();


router.use('/file', require('./uploadFile/route'));

module.exports = router;