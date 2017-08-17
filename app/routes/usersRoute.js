'use strict';

var express = require('express');
var router = express.Router();
var usersController = require('../controllers/usersController.js');
var PATHS = require('../config/paths.json');

router.post(PATHS.createUser, usersController.createUser);
router.post(PATHS.authenticate, usersController.authenticate);

module.exports = router;