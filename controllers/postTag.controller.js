/* eslint-disable no-underscore-dangle */
const Tag = require('../models/postTag.model');

module.exports = {
  create: async (req, res) => {
    if (!req.body.type) {
      res.status(400).json('Post Tag type required.');
    } else if (!req.body.status) {
      res.status(400).json('Post Tag status required.');
    } else if (!req.body.title) {
      res.status(400).json('Post Tag title required.');
    } else if (!req.body.lang) {
      res.status(400).json('Post Tag lang required.');
    } else {
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
        res.status(201).json(result._doc);
      } catch (error) {
        res.status(500).json(error);
      }
    }
  },
  updateById: async (req, res) => {
    if (!req.body.type) {
      res.status(400).json('Post Tag type required.');
    } else if (!req.body.status) {
      res.status(400).json('Post Tag status required.');
    } else if (!req.body.title) {
      res.status(400).json('Post Tag title required.');
    } else if (!req.body.lang) {
      res.status(400).json('Post Tag lang required.');
    } else {
      try {
        const tag = await Tag.findById({ _id: req.params.id });
        tag.type = req.body.type;
        tag.status = req.body.status;
        tag.title = req.body.title;
        tag.lang = req.body.lang;
        tag.content = req.body.content || tag.content;

        if (req.file) {
          tag.image = req.file.path.replace(/\\/g, '/');
        } else if (!req.file && tag.image !== undefined) {
          tag.image = undefined;
        }
        await tag.save();
        res.status(200).json(tag._doc);
      } catch (error) {
        res.status(500).json(error);
      }
    }
  },
  getOneById: async (req, res) => {
    try {
      const tag = await Tag.findOne({ _id: req.params.id });
      if (!tag) {
        res.status(404).json('Post Tag not found! :c');
      } else {
        res.status(200).json(tag._doc);
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getOneBySlug: async (req, res) => {
    try {
      const tag = await Tag.findOne({ slug: req.params.slug });
      if (!tag) {
        res.status(404).json('Post Tag not found! :c');
      } else {
        res.status(200).json(tag._doc);
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
      select: '_id title content image slug',
      sort: { date: -1 },
      limit: parseInt(req.query.limit, 10) || 5,
      page: parseInt(req.query.page, 10) || 1
    };
    try {
      const result = await Tag.paginate(query, options);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  removeById: async (req, res) => {
    try {
      const tag = await Tag.findById({ _id: req.params.id });
      if (!tag) {
        res.status(404).json('Tag not found! :c');
      } else {
        await Tag.deleteOne({ _id: req.params.id });
        res.status(200).json('Deleted.');
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
};
