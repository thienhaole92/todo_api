'use strict'

let express = require('express');
let router = express.Router();

router.use(function (req, res, next) {
    res.send(JSON.stringify({
        data: res.data,
        success: true,
        message: res.message
    }));
});

module.exports = router;