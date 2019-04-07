const fs = require('fs');
const path = require('path');
const Tag = require('../../models/postTag.model');

module.exports = async (req, res) => {
  try {
    const tag = await Tag.findById({ _id: req.params.id });
    if (!tag) {
      res.status(404).json('Tag not found! :c');
    } else {
      if (tag.image !== undefined) {
        fs.unlinkSync(path.resolve(__dirname, `../${tag.image}`));
      }
      await Tag.deleteOne({ _id: req.params.id });
      res.status(200).json('Deleted.');
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
