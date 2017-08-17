'use strict';

var tokenMiddleware = require('../middleware/token');
var Task = require('../models/task');
var User = require('../models/user');
var notificationsController = require('./notificationsController')

function createTask(req, res, next) {
    var description = req.body.description;
    var completeDate = new Date(req.body.completeDate);
    var priority = typeof req.body.priority == 'undefined' ? 'low' : req.body.priority;
    var saveAsAlarm = typeof req.body.saveAsAlarm == 'undefined' ? false : req.body.saveAsAlarm;
    var showAsNotification = typeof req.body.showAsNotification == 'undefined' ? true : req.body.showAsNotification;

    if (!description || !completeDate) {
        next({
            message: 'There was a missing or invalid parameter.'
        });
    } else {
        var userId = tokenMiddleware.getUserIdFromToken(req);
        User.findOne({
            '_id': userId
        }, function (err, user) {
            if (err) {
                next(err);
                return;
            }
            var task = new Task({
                description: description,
                completeDate: completeDate,
                priority: priority,
                saveAsAlarm: saveAsAlarm,
                showAsNotification: showAsNotification
            });
            task.save(function (err) {
                if (err) {
                    next(err);
                    return;
                }
            });

            user.tasks.push(task);
            user.save(function (error) {
                if (error) {
                    next(err);
                    return;
                }

                res.data = {
                    task: task
                };
                next();
            });
        });
    }
}

function completeTask(req, res, next) {
    var taskId = req.body.id;
    Task.findOne({
        '_id': taskId
    }, function (err, task) {
        if (err) {
            next(err);
            return;
        }
        if (task.completed) {
            next({
                message: 'You completed this task'
            });
            return;
        }
        task.completed = true;
        task.save(function (error) {
            if (error) {
                next(err);
                return;
            }
        });

        var userId = tokenMiddleware.getUserIdFromToken(req);
        User.findOne({
                '_id': userId
            }).populate('tasks')
            .exec(function handleQuery(error, user) {
                if (err) {
                    next(err);
                    return;
                }
                notificationsController.createCompletedNotification(user, function (notification, err) {
                    if (err) {
                        next(err);
                        return;
                    } else {
                        res.data = {
                            tasks: user.tasks
                        };
                        next();
                    }
                });
            });
    });
}

function checkCompletedAllTasks(tasks, cb) {
    for (task in tasks) {
        if (task.completed == false) {
            cb(false);
            break;
        }
    }
    cb(true);
}

module.exports = {
    createTask: createTask,
    completeTask: completeTask
};