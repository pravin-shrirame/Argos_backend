const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');  // make sure this file exists

router.post('/:taskId/assign', taskController.assignVendorsToTask);

module.exports = router;
