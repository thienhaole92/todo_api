'use strict';

var tokenMiddleware = require('../middleware/token');
var Notification = require('../models/notification');
var User = require('../models/user');

function createNotification(user, message, cb) {
    User.findOne({
        '_id': user._id
    }, function (err, user) {
        if (err) {
            cb(null, err);
            return;
        }
        var notification = new Notification({
            message: message,
            userId: user._id
        });
        notification.save(function (err) {
            if (err) {
                cb(null, err);
                return;
            }
        });

        user.notifications.push(notification);
        user.save(function (error) {
            if (error) {
                cb(nil, err);
                return;
            }
            cb(notification, null);
        });
    });
}

module.exports = {
    createNotification: createNotification
};