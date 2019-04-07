const Tag = require('../../models/postTag.model');

module.exports = async (req, res) => {
  try {
    const tag = await Tag.findOne({ _id: req.params.id });
    if (!tag) {
      res.status(404).json('Post Tag not found! :c');
    } else {
      /* eslint-disable no-underscore-dangle */
      res.status(200).json(tag._doc);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
