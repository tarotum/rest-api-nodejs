const Category = require('../models/category');
const Post = require('../models/post');
module.exports = {
  create: async (req, res) => {
    const newCategory = new Category({
      type: req.body.type,
      status: req.body.status || 'draft',
      title: req.body.title,
      content: req.body.content,
      autor: 'admin',
      lang: req.body.lang || 'en'
    });

    if (req.file) {
      newCategory.image = req.file.path.replace(/\\/g, '/');
    }

    try {
      const result = await newCategory.save();
      res.status(201).json({ result });
    } catch (error) {
      res.status(500).json({ error });
    }
  },
  getAll: async (req, res) => {
    const options = {
      select: '_id lang title content image slug author',
      sort: { date: -1 },
      limit: req.query.limit || 5,
      page: req.query.page || 1
    };

    if (req.query.post === 'show') {
      options.populate = { path: 'posts', select: '_id title' };
    }

    try {
      const result = await Category.paginate({ lang: req.lang }, options);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error });
    }
  },
  removeById: async (req, res) => {
    try {
      const category = await Category.findById({ _id: req.params.id });
      if (!category) {
        res.status(404).json({ message: 'Category not found! :c' });
      } else {
        if (category.posts.length > 0) {
          category.posts.map(async postId => {
            const categoryPost = await Post.findById({ _id: postId });
            if (categoryPost) {
              categoryPost.category = undefined;
              await categoryPost.save();
            }
          });
        }
        await Category.deleteOne({ _id: req.params.id });

        res
          .status(200)
          .json({ message: `Category ${category.title} deleted successfuly` });
      }
    } catch (error) {
      res.status(500).json({ error });
    }
  }
};
