const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const vendorController = require('../controllers/vendorController');

router.post('/upload', upload.single('file'), vendorController.uploadVendors);
router.get('/', vendorController.getVendors);

module.exports = router;
