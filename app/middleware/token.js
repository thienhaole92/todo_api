'use strict';

var jsonwebtoken = require('jsonwebtoken');
var CONFIG = require('../config/config.json');
var TOKEN_SECRET = CONFIG.token.secret;
var TOKEN_EXPIRES = parseInt(CONFIG.token.expiresInSeconds, 10);

function sign(payload) {
    var token = jsonwebtoken.sign({
        email: payload.email,
        id: payload._id
    }, TOKEN_SECRET, {
        expiresIn: TOKEN_EXPIRES
    });
    return token;
}

function verifyToken(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jsonwebtoken.verify(token, TOKEN_SECRET, function (err, decoded) {
            if (err) {
                next(err)
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        next({
            message: 'No token provided.'
        })
    }
}

function getTokenPayload(req) {
    var payload = null;
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        payload = jsonwebtoken.decode(token, {
            complete: true
        }).payload;
    }
    return payload;
}

function getUsernameFromToken(req) {
    var payload = getTokenPayload(req);
    if (payload) {
        return payload.username;
    }
    return null;
}

function getUserIdFromToken(req) {
    var payload = getTokenPayload(req);
    if (payload) {
        return payload.id;
    }
    return null;
}

module.exports = {
    sign: sign,
    verifyToken: verifyToken,
    getUsernameFromToken: getUsernameFromToken,
    getUserIdFromToken: getUserIdFromToken
};