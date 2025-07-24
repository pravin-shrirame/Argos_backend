const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Make sure uploads folder exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // e.g. 162939000.csv
  }
});

const upload = multer({ storage });

module.exports = upload;
