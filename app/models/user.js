'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var schema = new Schema({
    fullname: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    notifications: [{
        type: Schema.Types.ObjectId,
        ref: 'Notification'
    }],
    tasks: [{
        type: Schema.Types.ObjectId,
        ref: 'Task'
    }],
});

//save the user's password hashed
schema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (error, salt) {
            if (error) {
                return next(error);
            }
            bcrypt.hash(user.password, salt, null, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

//create method to compare password input to password saved in db
schema.methods.comparePassword = function (password, callback) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        if (err) {
            return callback(err, null);
        }
        callback(null, isMatch);
    });
};

module.exports = mongoose.model('User', schema, 'users');