'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    description: {
        type: String,
        required: true
    },
    completeDate: {
        type: Date,
        required: true
    },
    priority: {
        type: String,
        enum: ['low', 'normal', 'medium', 'high', 'strict'],
        default: 'low'
    },
    saveAsAlarm: {
        type: Boolean,
        default: false
    },
    showAsNotification: {
        type: Boolean,
        default: true
    },
    completed: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Task', schema, 'tasks');