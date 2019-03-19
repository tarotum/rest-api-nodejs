const express = require('express');

const Router = express.Router();

// Import middleware
const auth = require('../middleware/auth.middleware');
const validPost = require('../middleware/validPost.middleware');
const upload = require('../middleware/upload');

const PostController = require('../controllers/post.controller');

Router.get('/get/:id', PostController.getOneById);
Router.get('/:slug', PostController.getOneBySlug);
Router.get('/', PostController.getAll);
Router.post('/create', auth, upload.single('image'), validPost, PostController.create);
Router.put('/update/:id', auth, upload.single('image'), validPost, PostController.updateById);
Router.delete('/remove/:id', auth, PostController.removeById);

module.exports = Router;
