const express = require('express');
const path = require('path');

const Router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  switch (file.mimetype) {
    case 'image/jpeg':
      cb(null, true);
      break;
    case 'image/png':
      cb(null, true);
      break;
    case 'image/gif':
      cb(null, true);
      break;
    default:
      cb(null, false);
      break;
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter
});

Router.post('/save', upload.single('image'), (req, res) => {
  if (req.file) {
    res.status(201).sendFile(path.resolve(__dirname, `../uploads/${req.file.filename}`));
  }
});

module.exports = Router;
