const express = require('express');
const router = express.Router();
const multer = require('multer');
const projectController = require('../controllers/projectController');

const upload = multer({ dest: 'uploads/projects/' });

router.post('/upload', upload.single('file'), projectController.uploadProject);

module.exports = router;
