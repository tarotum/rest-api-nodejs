const express = require('express');
const Router = express.Router();
const multer = require('multer');

const language = require('../middleware/language');
const CategoryController = require('../controllers/category');

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
  res.render('pages/category');
});
Router.get('/:lang*?/', language, CategoryController.getAll);
Router.post('/', upload.single('image'), CategoryController.create);
Router.delete('/remove/:id', CategoryController.removeById);

module.exports = Router;
