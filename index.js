'use strict';

var express = require('express');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var bodyParser = require('body-parser');
var morgan = require('morgan');
var schedule = require('node-schedule');
var successedMiddleware = require('./app/middleware/successed');
var failureMiddleware = require('./app/middleware/failure');
var app = express();

var CONFIG = require('./app/config/config.json');
var PORT = process.env.PORT || parseInt(CONFIG.server.port, 10);
var HOST_NAME = CONFIG.server.hostName;
var DATABASE_NAME = CONFIG.database.name;
var DATABASE_URI = CONFIG.database.uri;

var uri = process.env.MONGOLAB_URI || DATABASE_URI;
console.log(uri);
// mongoose.connect(uri, {}, function (err, db) {
//     if (err) {
//         console.log('Connection Error ::: ', err);
//     } else {
//         console.log('Successfully Connected!');
//     }
// });

var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');
// Use connect method to connect to the Server 
MongoClient.connect(uri, function (err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    db.close();
});


var job = schedule.scheduleJob('00 23 * * *', function () {
    console.log('The answer to life, the universe, and everything!');
});

//Middlewares
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.get('/', function (req, res) {
    res.send('Welcome to API for TODO App');
});

var usersRoute = require('./app/routes/usersRoute');
var tasksRoute = require('./app/routes/tasksRoute');
app.use('/api/users', usersRoute);
app.use('/api/tasks', tasksRoute);

app.use(failureMiddleware.failure);
app.use(successedMiddleware);

var server = app.listen(PORT, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Server listening at http://%s:%s', host, port);
});