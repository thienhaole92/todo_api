'use strict';

var tokenMiddleware = require('../middleware/token');
var Notification = require('../models/notification');
var User = require('../models/user');

function createCompletedNotification(user, cb) {
    User.findOne({
        '_id': user._id
    }, function (err, user) {
        if (err) {
            cb(null, err);
            return;
        }
        var notification = new Notification({
            description: 'Hooray! You have completed the task'
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

function createCompletedAllTodayTasksNotification(user, cb) {
    User.findOne({
        '_id': user._id
    }, function (err, user) {
        if (err) {
            cb(null, err);
            return;
        }
        var notification = new Notification({
            description: 'Hooray! You have completed all the task for today'
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
    createCompletedNotification: createCompletedNotification,
    createCompletedAllTodayTasksNotification: createCompletedAllTodayTasksNotification
};