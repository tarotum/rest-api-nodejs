/* eslint-disable no-underscore-dangle */
const fs = require('fs');
const path = require('path');
const Post = require('../models/post.model');

module.exports = {
  // Creating post with image and tags
  create: async (req, res) => {
    const { type, status, title, content, lang, tags } = req.body;

    // Creating post if all if required fields are exist
    const newPost = new Post({
      type,
      status: status || 'draft',
      title,
      content,
      lang: lang || 'en'
    });

    if (tags) {
      // Splitting req string tags into array with tag ids
      // string must contain tags id divided by comma
      newPost.tags = tags.split(',');
    }

    if (req.file) {
      // Replacing divider in image path
      newPost.image = req.file.path.replace(/\\/g, '/');
    }
    try {
      const result = await newPost.save();

      // Return crated post if save succesfull
      // returning only useful info without mongodb services fields
      res.status(201).json(result._doc);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  // Updating post with image and tags
  updateById: async (req, res) => {
    const { type, status, title, lang, content, tags } = req.body;

    try {
      const post = await Post.findById({ _id: req.params.id });

      if (!post) return res.status(404).json('Post not found.');

      post.type = type || post.type;
      post.status = status || post.status;
      post.title = title || post.title;
      post.lang = lang || post.lang;
      post.content = content || post.content;

      if (tags) {
        post.tags = tags.split(',');
      } else if (tags === '' && post.tags !== undefined) {
        post.tags = undefined;
      }

      if (req.file) {
        post.image = req.file.path.replace(/\\/g, '/');
      } else if (!req.file && post.image !== undefined) {
        post.image = undefined;
      }
      await post.save();
      res.status(200).json(post._doc);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getOneById: async (req, res) => {
    try {
      const post = await Post.findOne({ _id: req.params.id });
      if (!post) {
        res.status(404).json('Post not found! :c');
      } else {
        res.status(200).json(post._doc);
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getOneBySlug: async (req, res) => {
    try {
      const post = await Post.findOne({ slug: req.params.slug });
      if (!post) {
        res.status(404).json('Post not found! :c');
      } else {
        res.status(200).json(post._doc);
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getAll: async (req, res) => {
    const query = {};
    if (req.query.lang !== undefined) {
      query.lang = req.query.lang;
    }
    if (req.query.type !== undefined) {
      query.type = req.query.type;
    }
    if (req.query.status !== undefined) {
      query.status = req.query.status;
    }
    if (req.query.tags !== undefined) {
      const tagsArr = req.query.tags.split(',');
      query.tags = { $in: tagsArr };
    }
    const options = {
      select: '_id title status content image slug tags',
      sort: { date: -1 },
      limit: parseInt(req.query.limit, 10) || 5,
      page: parseInt(req.query.page, 10) || 1,
      populate: { path: 'tags', select: 'title' }
    };
    try {
      const result = await Post.paginate(query, options);
      res.status(200).json({ ...result });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  removeById: async (req, res) => {
    try {
      const post = await Post.findById({ _id: req.params.id });
      if (!post) {
        res.status(404).json('Post not found.');
      } else {
        if (post.image !== undefined) {
          fs.unlinkSync(path.resolve(__dirname, `../${post.image}`));
        }
        await Post.deleteOne({ _id: req.params.id });
        res.status(200).json('Deleted.');
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
};
