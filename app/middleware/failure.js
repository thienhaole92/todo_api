'use strict'

function failure(err, req, res, next) {
    res.send(JSON.stringify({
        success: false,
        message: err.message
    }));
}

module.exports = {
    failure: failure
}