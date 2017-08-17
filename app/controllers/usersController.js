'use strict';

var User = require('../models/user');
var tokenMiddleware = require('../middleware/token');

function createUser(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    var fullname = req.body.fullname;
    if (!email || !password) {
        next({
            message: 'There was a missing or invalid parameter.'
        });
    } else {
        User.findOne({
            'email': email
        }, function (err, user) {
            if (err) {
                next(err);
                return;
            }
            if (user) {
                next({
                    message: 'User with the email \'' + req.body.email + '\' already exists.'
                })
                return;
            }
            var newUser = new User({
                email: email,
                password: password
            });
            newUser.save(function (err, savedUser) {
                if (err) {
                    next(err);
                    return;
                } else {
                    var token = tokenMiddleware.sign(user);
                    res.data = {
                        user: {
                            id: savedUser._id,
                            email: savedUser.email,
                            fullname: savedUser.fullname
                        },
                        token: token
                    };
                    next();
                }
            });
        });
    }
}

function authenticate(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    if (!email || !password) {
        next({
            message: 'There was a missing or invalid parameter.'
        });
    } else {
        User.findOne({
            'email': email
        }, function (err, user) {
            if (err) {
                next(err);
                return;
            }
            if (!user) {
                next({
                    message: 'User with the email \'' + req.body.email + '\' dose not exists.'
                })
                return;
            }
            //check if password matches
            user.comparePassword(password, function (err, isMatch) {
                if (isMatch && !err) {
                    var token = tokenMiddleware.sign(user);
                    res.data = {
                        user: {
                            id: user._id,
                            email: user.email,
                            fullname: user.fullname
                        },
                        token: token
                    };
                    next();
                } else {
                    next(err);
                }
            });
        });
    }
}

module.exports = {
    createUser: createUser,
    authenticate: authenticate
};