const multer = require('multer');

// Upload single image
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

module.exports = upload;
