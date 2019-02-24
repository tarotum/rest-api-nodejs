const express = require('express');

const Router = express.Router();
const multer = require('multer');

// const language = require('../middleware/language.middleware');
const PostController = require('../controllers/post.controller');

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
// Router.get('/create/', (req, res) => {
//   res.render('pages/post');
// });
// Error here !!!!!!!
Router.get('/:slug', PostController.getOneBySlug);
Router.get('/', PostController.getAll);
Router.post('/create', upload.single('image'), PostController.create);
Router.patch('/update/:id', upload.single('image'), PostController.updateById);
Router.delete('/remove/:id', PostController.removeById);

module.exports = Router;
