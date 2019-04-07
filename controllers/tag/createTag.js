const Tag = require('../../models/postTag.model');

module.exports = async (req, res) => {
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
      content: req.body.content,
      lang: req.body.lang || 'en'
    });
    if (req.file) {
      newTag.image = req.file.path.replace(/\\/g, '/');
    }

    try {
      const result = await newTag.save();
      /* eslint-disable no-underscore-dangle */
      res.status(201).json(result._doc);
    } catch (error) {
      res.status(500).json(error);
    }
  }
};
