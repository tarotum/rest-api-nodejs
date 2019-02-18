const express = require('express');
const Router = express.Router();
const multer = require('multer');

const PostController = require('../controllers/post');
const language = require('../middleware/language');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
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
    default:
      cb(null, false);
      break;
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});
Router.get('/create/', (req, res) => {
  res.render('pages/post');
});
Router.get('/:lang*?/', language, PostController.getAll);
Router.post('/', upload.single('image'), PostController.create);
Router.delete('/remove/:id', PostController.removeById);

module.exports = Router;
