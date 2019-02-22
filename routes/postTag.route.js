const express = require('express');
const Router = express.Router();
const multer = require('multer');

// const language = require('../middleware/language.middleware');
const TagController = require('../controllers/postTag.controller');

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
// Router.get('/create/', (req, res) => {
//   res.render('pages/post');
// });
// Error here !!!!!!!
Router.get('/:slug', TagController.getOneBySlug);
Router.get('/', TagController.getAll);
Router.post('/create', upload.single('image'), TagController.create);
Router.patch('/update/:id', upload.single('image'), TagController.updateById);
Router.delete('/remove/:id', TagController.removeById);

module.exports = Router;
