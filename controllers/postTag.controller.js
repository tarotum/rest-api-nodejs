const Tag = require('../models/postTag.model');

module.exports = {
  create: async (req, res) => {
    const newTag = new Tag({
      type: req.body.type,
      status: req.body.status || 'draft',
      title: req.body.title.trim(),
      content: req.body.content.trim(),
      lang: req.body.lang || 'en'
    });
    if (req.file) {
      newTag.image = req.file.path.replace(/\\/g, '/');
    }

    try {
      const result = await newTag.save();
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
      updateFields[key] = value.trim();
    }
    if (req.file) {
      updateFields.image = req.file.path.replace(/\\/g, '/');
    }

    try {
      const result = await Tag.findOneAndUpdate(
        { _id: req.params.id },
        { $set: updateFields },
        { new: true }
      );
      res.status(200).json({ result });
    } catch (error) {
      res.status(500).json({ error });
    }
  },
  getOneById: async (req, res) => {
    try {
      const tag = await Tag.findOne({ _id: req.params.id });
      if (!tag) {
        res.status(404).json({ message: 'Post Tag not found! :c' });
      } else {
        res.status(200).json({ tag });
      }
    } catch (error) {
      res.status(500).json({ error });
    }
  },
  getOneBySlug: async (req, res) => {
    try {
      const tag = await Tag.findOne({ slug: req.params.slug });
      if (!tag) {
        res.status(404).json({ message: 'Post Tag not found! :c' });
      } else {
        res.status(200).json({ tag });
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
      select: '_id title content image slug',
      sort: { date: -1 },
      limit: parseInt(req.query.limit, 10) || 5,
      page: parseInt(req.query.page, 10) || 1
    };
    try {
      const result = await Tag.paginate(query, options);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error });
    }
  },
  removeById: async (req, res) => {
    try {
      const tag = await Tag.findById({ _id: req.params.id });
      if (!tag) {
        res.status(404).json({ message: 'Tag not found! :c' });
      } else {
        await Tag.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: `Tag ${tag.title} deleted successfuly` });
      }
    } catch (error) {
      res.status(500).json({ error });
    }
  }
};
