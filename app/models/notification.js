'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    description: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Notification', schema, 'notifications');