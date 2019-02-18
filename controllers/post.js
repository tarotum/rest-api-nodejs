const Post = require('../models/post');
const Category = require('../models/category');

module.exports = {
  create: async (req, res) => {
    const newPost = new Post({
      type: req.body.type,
      status: req.body.status || 'draft',
      title: req.body.title,
      content: req.body.content,
      autor: 'admin',
      lang: req.body.lang || 'en'
    });

    if (req.body.category) {
      newPost.category = req.body.category;
    }

    if (req.file) {
      newPost.image = req.file.path.replace(/\\/g, '/');
    }

    try {
      const result = await newPost.save();

      // Connect post with category if category has set
      if (req.body.category) {
        const savedPost = await result
          .populate({ path: 'category', select: '_id title' })
          .execPopulate();

        const postCategory = await Category.findById({
          _id: req.body.category
        });
        postCategory.posts.push(savedPost._id);
        await postCategory.save();

        res.status(201).json({
          post: savedPost
        });
      } else {
        res.status(201).json({
          post: result
        });
      }
    } catch (error) {
      res.status(500).json({
        error
      });
    }
  },
  getAll: async (req, res) => {
    const options = {
      select: '_id lang type title content image slug author',
      sort: { date: -1 },
      limit: parseInt(req.query.limit, 10) || 5,
      page: parseInt(req.query.page, 10) || 1
    };

    if (req.query.cat === 'show') {
      options.populate = { path: 'category', select: '_id title' };
    }

    try {
      const result = await Post.paginate({ lang: req.lang }, options);
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
        if (post.category !== undefined) {
          const postCategory = await Category.findById({ _id: post.category });
          postCategory.posts = postCategory.posts.filter(
            postId => postId != req.params.id
          );
          await postCategory.save();
        }
        await Post.deleteOne({ _id: req.params.id });

        res
          .status(200)
          .json({ message: `Post ${post.title} deleted successfuly` });
      }
    } catch (error) {
      res.status(500).json({ error });
    }
  }
};
