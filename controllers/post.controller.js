const Post = require('../models/post.model');

module.exports = {
  create: async (req, res) => {
    const newPost = new Post({
      type: req.body.type,
      status: req.body.status || 'draft',
      title: req.body.title.trim(),
      content: req.body.content.trim(),
      lang: req.body.lang || 'en'
    });

    if (req.body.tags) {
      newPost.tags = req.body.tags.split(',');
    }

    if (req.file) {
      newPost.image = req.file.path.replace(/\\/g, '/');
    }

    try {
      const result = await newPost.save();
      res.status(201).json({
        post: result
      });
    } catch (error) {
      res.status(500).json({
        error
      });
    }
  },
  updateById: async (req, res) => {
    const updateFields = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(req.body)) {
      if (key === 'tags') {
        const tagsValue = value.split(',');
        updateFields.tags = tagsValue;
      } else {
        updateFields[key] = value.trim();
      }
    }
    if (req.file) {
      updateFields.image = req.file.path.replace(/\\/g, '/');
    }

    try {
      const result = await Post.findOneAndUpdate(
        { _id: req.params.id },
        { $set: updateFields },
        { new: true }
      );
      res.status(200).json({
        post: result
      });
    } catch (error) {
      res.status(500).json({ error });
    }
  },
  getOneById: async (req, res) => {
    try {
      const post = await Post.findOne({ _id: req.params.id });
      if (!post) {
        res.status(404).json({ message: 'Post not found! :c' });
      } else {
        res.status(200).json({ post });
      }
    } catch (error) {
      res.status(500).json({ error });
    }
  },
  getOneBySlug: async (req, res) => {
    try {
      const post = await Post.findOne({ slug: req.params.slug });
      if (!post) {
        res.status(404).json({ message: 'Post not found! :c' });
      } else {
        res.status(200).json({ post });
      }
    } catch (error) {
      res.status(500).json({ error });
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
      select: '_id title content image slug tags',
      sort: { date: -1 },
      limit: parseInt(req.query.limit, 10) || 5,
      page: parseInt(req.query.page, 10) || 1,
      populate: { path: 'tags', select: 'title' }
    };
    try {
      const result = await Post.paginate(query, options);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error });
    }
  },
  removeById: async (req, res) => {
    try {
      const post = await Post.findById({ _id: req.params.id });
      if (!post) {
        res.status(404).json({ message: 'Post not found! :c' });
      } else {
        await Post.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: `Post ${post.title} deleted successfuly` });
      }
    } catch (error) {
      res.status(500).json({ error });
    }
  }
};
