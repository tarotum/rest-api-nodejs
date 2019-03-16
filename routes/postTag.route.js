const express = require('express');

const Router = express.Router();
const multer = require('multer');

const auth = require('../middleware/auth.middleware');
const TagController = require('../controllers/postTag.controller');

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
Router.get('/get/:id', TagController.getOneById);
Router.get('/:slug', TagController.getOneBySlug);
Router.get('/', TagController.getAll);
Router.post('/create', auth, upload.single('image'), TagController.create);
Router.put('/update/:id', auth, upload.single('image'), TagController.updateById);
Router.delete('/remove/:id', auth, TagController.removeById);

module.exports = Router;
