'use strict';

var express = require('express');
var router = express.Router();
var tasksController = require('../controllers/tasksController.js');
var PATHS = require('../config/paths.json');
var tokenMiddleware = require('../middleware/token');

router.post(PATHS.createTask, tokenMiddleware.verifyToken, tasksController.createTask);
router.put(PATHS.completeTask, tokenMiddleware.verifyToken, tasksController.completeTask);

module.exports = router;