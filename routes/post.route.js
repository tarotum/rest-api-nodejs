const express = require('express');

const Router = express.Router();

// Import middleware
const auth = require('../middleware/auth.middleware');
const validPost = require('../middleware/validPost.middleware');
const upload = require('../middleware/upload');

const PostController = require('../controllers/post');

Router.get('/get/:id', PostController.getById);
Router.get('/:slug', PostController.getBySlug);
Router.get('/', PostController.getAll);
Router.post('/create', auth, upload.single('image'), validPost, PostController.create);
Router.put('/update/:id', auth, upload.single('image'), PostController.updateById);
Router.delete('/remove/:id', auth, PostController.removeById);

module.exports = Router;
