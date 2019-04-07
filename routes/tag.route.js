const express = require('express');

const Router = express.Router();

// Import middleware
const upload = require('../middleware/upload');
const auth = require('../middleware/auth.middleware');

const TagController = require('../controllers/tag');

Router.get('/get/:id', TagController.getOneById);
Router.get('/:slug', TagController.getOneBySlug);
Router.get('/', TagController.getAll);
Router.post('/create', auth, upload.single('image'), TagController.create);
Router.put('/update/:id', auth, upload.single('image'), TagController.updateById);
Router.delete('/remove/:id', auth, TagController.removeById);

module.exports = Router;
