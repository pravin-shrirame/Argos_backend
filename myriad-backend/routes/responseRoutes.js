const express = require('express');
const router = express.Router();
const responseController = require('../controllers/responseController');

router.post('/submit', responseController.submitResponse);

router.get('/project/:project_id', responseController.getResponsesByProject);

module.exports = router;
