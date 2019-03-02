const express = require('express');
const multer = require('multer');
const auth = require('../middleware/auth.middleware');

const Router = express.Router();

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

Router.post('/save', auth, upload.single('image'), (req, res) => {
  if (req.file) {
    res.status(201).json({ url: req.file.path });
  } else {
    res.status(500).json({ error: 'Something broke!' });
  }
});

module.exports = Router;
