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
      /* eslint-disable no-underscore-dangle */
      res.status(200).json(tag._doc);
    } catch (error) {
      res.status(500).json(error);
    }
  }
};
