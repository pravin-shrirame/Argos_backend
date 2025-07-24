const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');

router.post('/assign', assignmentController.assignTaskToVendors);

module.exports = router;  // <-- This must be present!
